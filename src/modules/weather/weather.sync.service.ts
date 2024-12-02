import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { HttpService } from "../../shared/http.service";


@Injectable()
export class WeatherSyncService {
  private readonly logger = new Logger(WeatherSyncService.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly httpService: HttpService,
  ) {}

  async fetchWeatherData(location: string): Promise<any> {
    try {
      const apiUrl = `https://api.weatherapi.com/v1/current.json?key=f529241bc32e403eb3b135637241811&q=${location}&days=3&lang=en`;
      const response = await this.httpService.get(apiUrl)
      const { location: loc, current } = response;

      // Transform the response into the required format
      const weatherData = {
        name: loc.name,
        country: loc.country,
        temp_c: current.temp_c,
        condition: current.condition.text,
        icon: current.condition.icon,
        windSpeed: current.wind_kph,
        humidity: current.humidity,
        uvIndex: current.uv,
        localTime: loc.localtime,
      };

      return weatherData;
    } catch (error) {
      this.logger.error('Failed to fetch weather data', error.stack);
      throw new Error('Weather API fetch failed');
    }
  }
}
