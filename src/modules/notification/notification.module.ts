import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { MailerModule } from "@nestjs-modules/mailer";
import { NotificationGateway } from "./notification.gateway";
import { EmailNotificationStrategy } from "./strategy/email.strategy";
import { WebsocketNotificationStrategy } from "./strategy/websocket.strategy";
import { EmailNotificationService } from "./services/mail.service";
import * as dotenv from "dotenv";
import * as process from "node:process";

dotenv.config();

@Module({
  imports: [
  MailerModule.forRoot({
    transport: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    },
  }),
],
providers: [NotificationService,
  NotificationGateway,
  EmailNotificationStrategy,
  WebsocketNotificationStrategy,
  EmailNotificationService,
],
  exports: [NotificationService, EmailNotificationService,],
})
export class NotificationModule {}
