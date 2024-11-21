import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailerModule } from "@nestjs-modules/mailer";
import { NotificationGateway } from "./notification.gateway";
import { EmailNotificationStrategy } from "./strategy/email.strategy";
import { WebsocketNotificationStrategy } from "./strategy/websocket.strategy";


@Module({
  imports: [
  MailerModule.forRoot({
    transport: {
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password',
      },
    },
  }),
],
providers: [NotificationService,
  NotificationGateway,
  EmailNotificationStrategy,
  WebsocketNotificationStrategy],
  exports: [NotificationService],
})
export class NotificationModule {}
