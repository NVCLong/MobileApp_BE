import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TracingLoggerModule } from "./modules/tracing-logger/tracing-logger.module";
import { UserModule } from "./modules/user/user.module";
import { ValidationModule } from "./modules/email-validation/validation.module";
import * as dotenv from "dotenv";
import { TracingLoggerMiddleware } from "./modules/tracing-logger/tracing-logger.middleware";

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://mobileApplication:7DIDNohssRKgsi7c@cluster0.cwr8e.mongodb.net/test'),
    TracingLoggerModule,
    UserModule,
    ValidationModule.register({
      abstractApiKey: process.env.API_KEY_EMAIL_VALIDATION || "",
      validatePublicAPI: process.env.API_VALIDATE_EMAIL || "",
      isPublic: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(TracingLoggerMiddleware).forRoutes('*');
  }
}
