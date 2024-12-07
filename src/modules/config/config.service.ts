import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Configs } from "./schema/config.schema";
import { Model, set } from "mongoose";
import { TracingLogger } from "../tracing-logger/tracing-logger.service";
import { ValueDataType } from "./config.constant";
import { UpdateConfigsRequest } from "./dtos/updateConfigsRequest";

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
    return this.configsModel.find();
  }
}