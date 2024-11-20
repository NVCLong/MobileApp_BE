import { NotificationPayload, NotificationStrategy } from "./notification.strategy";

export class NotificationContext {
  private strategy: NotificationStrategy;

  setStrategy(strategy: NotificationStrategy) {
    this.strategy = strategy;
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    if (!this.strategy) {
      throw new Error('Notification strategy is not set');
    }
    await this.strategy.send(payload);
  }
}