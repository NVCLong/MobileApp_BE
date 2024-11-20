import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from './schemas/weather.schema';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  constructor(
    @InjectModel(Weather.name) private readonly weatherModel: Model<Weather>,
  ) {}

  // Update or create weather data in the database
  async updateWeatherData(location: string, weatherData: Partial<Weather>) {
    try {
      const existingWeather = await this.weatherModel.findOne({ name: location }).exec();

      if (existingWeather) {
        this.logger.log(`Updating weather data for location: ${location}`);
        return this.weatherModel.updateOne(
          { name: location },
          { ...weatherData, updatedAt: new Date() },
        );
      } else {
        this.logger.log(`Creating new weather data for location: ${location}`);
        const newWeather = new this.weatherModel({ ...weatherData });
        return newWeather.save();
      }
    } catch (error) {
      this.logger.error('Failed to update or create weather data', error.stack);
      throw new Error('Database operation failed');
    }
  }

  // Retrieve weather data for a specific location
  async getWeatherData(location: string): Promise<Weather | null> {
    try {
      return this.weatherModel.findOne({ name: location }).exec();
    } catch (error) {
      this.logger.error('Failed to retrieve weather data', error.stack);
      throw new Error('Database query failed');
    }
  }
}
