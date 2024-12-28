import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Configs } from "./schema/config.schema";
import { Model, set } from "mongoose";
import { TracingLogger } from "../tracing-logger/tracing-logger.service";
import { iconConfig, ignoreSettingFields, ValueDataType } from "./config.constant";
import { UpdateConfigsRequest } from "./dtos/updateConfigsRequest";
import { UpdateIconConfigRequest } from "./dtos/update-icon-config.request.dto";
import { FieldOptions, Options } from "./dtos/field-options-response.dto";

@Injectable()
export class ConfigApplyService{
  constructor(@InjectModel(Configs.name) private  readonly configsModel: Model<Configs>, private readonly logger: TracingLogger) {
    this.logger.setContext(ConfigApplyService.name);
  }

  async updateConfig(name: string, settingValue: string, dataType?: string, isActive?: boolean){
    if(!name){
      this.logger.debug(`Missing config name ${name}`);
      throw new BadRequestException(`Missing config name`);
    }
    if(!settingValue){
      this.logger.debug(`Missing setting values ${settingValue}`);
      throw new BadRequestException(`Missing setting values ${settingValue}`);
    }
    const config = await this.configsModel.findOne({configName: name});
    // in case data type is not declare set value as string;
    let transformData;
    transformData= settingValue
    if(dataType) {
      this.logger.debug(`Setting values for ${name} with value ${dataType}`);
      dataType= dataType.toLowerCase();
      switch(dataType) {
        case ValueDataType.STRING: {
          break;
        }
        case ValueDataType.NUMBER: {
          if (!isNaN(Number(settingValue))) {
            transformData = Number(settingValue);
            break;
          }
          throw new BadRequestException(`Invalid data type for input`);
        }
        case ValueDataType.DATE: {
          transformData = new Date(settingValue);
          break;
        }
        case ValueDataType.BOOLEAN: {
          transformData =  Boolean(settingValue);
          break
        }
        case ValueDataType.ARRAY: {
          transformData = settingValue.split(',');
          break;
        }
        default : {
          break;
        }
      }
    }
    if(config){
      this.logger.debug(`Update existing config`);
      config.configValue = transformData;
      config.configName= name;
      await  config.save();
      return {
        status: 'success',
        message: 'Update successfully'
      }
    }
    this.logger.debug(`Create new configs`);
    const newConfig = new this.configsModel({ configName: name, configValue: transformData });
    await newConfig.save(); // Save the new config
  }

  async updateMultipleConfigs(updateRequest: UpdateConfigsRequest[]){
    for(const update of updateRequest){
      const {name, settingValue,dataType, isActive} = update;
      await this.updateConfig(name, settingValue, dataType, isActive)
    }
    return updateRequest;
  }

  async getConfigs(){
    const allSettings = await this.configsModel.find();
    const ignoreConfigs = await  this.configsModel.findOne({configName: "IgnoreConfigs"});
    const returnSettings = allSettings.filter(setting => !ignoreConfigs.configValue.includes(setting.configName));
    const response = [];
    const iconConfigs = allSettings.find(setting => setting.configName === iconConfig);
    returnSettings.forEach((setting) =>{
      const {configName, configValue} = setting;
      const values = [];
      if (Array.isArray(configValue)) {
        configValue.forEach(setting => {
          const icon = iconConfigs.configValue[setting.trim()];
          if(icon) {
            this.logger.debug(`Setting value for ${setting} with icon ${icon}`);
            values.push({ optionName: setting.trim(), icon } as Options)
          }else {
            const defaultIcon = iconConfigs.configValue["DEFAULT"];
            this.logger.debug(`Setting value for ${setting} with default icon `);
            values.push({ optionName: setting.trim(), icon: defaultIcon });
          }
        })
      }
      response.push({configName: configName, configValue: values} as FieldOptions)
    })

    return response;
  }


  async saveIconConfig(req: UpdateIconConfigRequest){
    if(req.settingValues.length === 0 || !req.settingName){
      throw  new BadRequestException("Missing Config fields");
    }

    const mapFieldNameToIcon = new Map<string, string>();

    req.settingValues.forEach((item) =>{
      this.logger.debug(`Setting icon ${item.icon} for ${item.fieldName}`);
      mapFieldNameToIcon.set(item.fieldName, item.icon);
    })

    const newConfig = new this.configsModel({configName: req.settingName, configValue: mapFieldNameToIcon});
    return newConfig.save();
  }
}