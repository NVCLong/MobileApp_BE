import { Controller, Get, Param } from "@nestjs/common";
import { WeatherService } from './weather.service';
import { Weather } from "./schemas/weather.schema";

@Controller("weather")
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}


  @Get(':country')
  async getWeather(@Param('country') country: string): Promise<Weather | null> {
    return this.weatherService.getWeatherData(country);
  }
}
