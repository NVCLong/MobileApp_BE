import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { QuotesSyncService } from "./quotes.sync.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Quote, QuotesSchema } from "./quotes.schema";
import { UserModule } from "../user/user.module";
import { HttpModule } from '@nestjs/axios';
import { HttpService } from "../../shared/http.service";
import { User, UserSchema } from "../user/schemas/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quote.name, schema: QuotesSchema}, {name: User.name, schema: UserSchema}]),
    UserModule,
    HttpModule
  ],
  controllers: [QuotesController],
  providers: [QuotesService,QuotesSyncService, HttpService],
  exports: [QuotesService, QuotesSyncService, HttpService]
})
export class QuotesModule {}
