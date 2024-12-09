import { Injectable } from '@nestjs/common';
import { NotificationContext } from "../notification.context";
import { MailerService } from "@nestjs-modules/mailer";
import { NotificationGateway } from "../notification.gateway";
import { NotificationPayload } from "../notification.strategy";
import { EmailNotificationStrategy } from "../strategy/email.strategy";
import { WebsocketNotificationStrategy } from "../strategy/websocket.strategy";

@Injectable()
export class NotificationService {
  private readonly context: NotificationContext;

  constructor(
    private readonly mailerService: MailerService,
    private readonly notificationGateway: NotificationGateway,
  ) {
    this.context = new NotificationContext();
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    // Assign strategy based on the notification type
    if (payload.type === 'email') {
      this.context.setStrategy(new EmailNotificationStrategy(this.mailerService));
    } else if (payload.type === 'websocket') {
      this.context.setStrategy(new WebsocketNotificationStrategy(this.notificationGateway));
    } else {
      throw new Error(`Unsupported notification type: ${payload.type}`);
    }

    // Execute the notification
    await this.context.sendNotification(payload);
  }
}
