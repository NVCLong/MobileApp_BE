import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TracingLoggerMiddleware } from "./modules/tracing-logger/tracing-logger.middleware";
import { Logger } from "@nestjs/common";
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from "@nestjs/platform-socket.io";
import { TasksService } from "./modules/tasks/tasks.service";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new IoAdapter(app));
  app.setGlobalPrefix('/api');

  const config = new DocumentBuilder()
    .setTitle('Habit Tracking API')
    .setDescription('API documentation for Habit Tracking')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.use(cookieParser());
  app.use(TracingLoggerMiddleware);

  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger();
  logger.log("Application listen on http://localhost:3000/api ");
}
bootstrap();
