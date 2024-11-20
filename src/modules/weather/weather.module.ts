import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { WeatherController } from './weather.controller';
import { Weather, WeatherSchema } from "./schemas/weather.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { WeatherSyncService } from "./weather.sync.service";
import { HttpService } from "../../shared/http.service";

@Module({
  imports:[
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    HttpModule
  ],
  controllers: [WeatherController],
  providers: [WeatherService, WeatherSyncService, HttpService],
  exports: [WeatherService, WeatherSyncService, HttpService]
})
export class WeatherModule {}
