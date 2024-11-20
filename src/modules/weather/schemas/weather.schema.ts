import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Weather extends Document {
  @Prop({ required: true })
  name: string; // City name

  @Prop({ required: true })
  country: string; // Country name

  @Prop({ required: true })
  temp_c: number; // Current temperature in Celsius

  @Prop({ required: true })
  condition: string; // Weather condition description

  @Prop({ required: true })
  icon: string; // URL to weather icon

  @Prop({ required: true })
  windSpeed: number; // Wind speed in kph

  @Prop({ required: true })
  humidity: number; // Humidity percentage

  @Prop({ required: true })
  uvIndex: number; // UV index

  @Prop({ required: true })
  localTime: string; // Local time in the city
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
