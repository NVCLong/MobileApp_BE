import { Module } from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";


@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://mobileApplication:7DIDNohssRKgsi7c@cluster0.cwr8e.mongodb.net/')],
  controllers: [],
  providers: [],
})
export class AppModule {}
