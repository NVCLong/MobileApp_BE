import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import { DefaultHabitsModule } from './default_habits/default_habits.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://mobileApplication:7DIDNohssRKgsi7c@cluster0.cwr8e.mongodb.net/'), DefaultHabitsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
