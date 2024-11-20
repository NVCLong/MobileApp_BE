import { NotificationPayload, NotificationStrategy } from "../notification.strategy";
import { MailerService } from "@nestjs-modules/mailer";

export class EmailNotificationStrategy implements NotificationStrategy {
  constructor(private readonly mailerService: MailerService) {
  }

  async send(payload: NotificationPayload): Promise<void> {
    if(payload.type !== 'email') {
      throw new Error('Invalid notification type');
    }

    await this.mailerService.sendMail({
      to: payload.target,
      subject: 'Notification',
      text: payload.message,
      html: `<p>${payload.message}</p>`
    })
  }
}