import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from './schemas/weather.schema';
import { Country } from "./schemas/enum/countries.enum";

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  constructor(
    @InjectModel(Weather.name) private readonly weatherModel: Model<Weather>,
  ) {}

  // Update or create weather data in the database
  async updateWeatherData(location: string, weatherData: Partial<Weather>) {

    if (!this.isValidLocation(location)) {
      this.logger.error(`Invalid location: ${location}`);
      throw new Error(`Location "${location}" is not a valid country.`);
    }

    try {
      const existingWeather = await this.weatherModel.findOne({ country: location }).exec();

      if (existingWeather) {
        this.logger.log(`Updating weather data for location: ${location}`);
        return this.weatherModel.updateOne(
          { country: location },
          { ...weatherData, updatedAt: new Date() },
        );
      } else {
        this.logger.log(`Creating new weather data for location: ${location}`);
        const newWeather = new this.weatherModel({ ...weatherData, country: location });
        return newWeather.save();
      }
    } catch (error) {
      this.logger.error('Failed to update or create weather data', error.stack);
      throw new Error('Database operation failed');
    }
  }

  // Retrieve weather data for a specific location
  async getWeatherData(location: string): Promise<Weather | any> {
    if (!this.isValidLocation(location)) {
      this.logger.error(`Invalid location: ${location}`);
      return { success: false, message: `Location "${location}" is not a valid country.` };
    }

    try {
      this.logger.log(`Retrieving weather data for location: ${location}`);
      const weatherData = await this.weatherModel.findOne({ country: location }).exec();
      if (weatherData) {
        return weatherData;
      } else {
        return { success: false, message: 'No weather data found for the specified location.' };
      }
    } catch (error) {
      this.logger.error('Failed to retrieve weather data', error.stack);
      return { success: false, message: 'Database query failed' };
    }
  }

  private isValidLocation(location: string): boolean {
    return Object.values(Country).includes(location as Country);
  }
}
