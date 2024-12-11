import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ConfigApplyService } from "./config.service";
import { HttpService } from "@nestjs/axios";
import { TracingLogger } from "../tracing-logger/tracing-logger.service";
import { UpdateConfigsRequest } from "./dtos/updateConfigsRequest";

@Controller('configs')
export class ConfigController {
  constructor(
    private readonly configApplyService : ConfigApplyService,
    private readonly logger: TracingLogger,
  ) {
    this.logger.setContext(ConfigController.name);
  }

  @Post('')
  async updateConfigs(@Body("")request: UpdateConfigsRequest[]){
    try{
      return this.configApplyService.updateMultipleConfigs(request);
    }catch (e){
      this.logger.error("Error updating configs");
      throw e;
    }
  }

  @Get('allConfigs')
  async getAllConfigs() {
    try{
      return this.configApplyService.getConfigs();
    }catch (e){
      this.logger.error("Error getting all configs");
      throw e;
    }
  }
}
