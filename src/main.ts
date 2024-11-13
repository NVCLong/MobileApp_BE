import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TracingLoggerMiddleware } from "./modules/tracing-logger/tracing-logger.middleware";
import { Logger } from "@nestjs/common";
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api')
  await app.listen(process.env.PORT ?? 3000);
  app.use(helmet());
  app.use(cookieParser());
  app.use(TracingLoggerMiddleware);
  const logger = new Logger();
  logger.log("Application listen on http://localhost:3000/api ");
}
bootstrap();
