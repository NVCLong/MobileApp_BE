import { NotificationPayload, NotificationStrategy } from "../notification.strategy";
import { NotificationGateway } from "../notification.gateway";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WebsocketNotificationStrategy implements NotificationStrategy {
  private readonly eventMapping: Record<string, (data: any) => void>;

  constructor(private readonly gateway: NotificationGateway) {
    // Map targets to specific gateway methods
    this.eventMapping = {
      dailyNotification: this.gateway.sendDailyNotification.bind(this.gateway),
      weatherNotification: this.gateway.sendWeatherNotification.bind(this.gateway),
    };
  }

  async send(payload: NotificationPayload): Promise<void> {
    if (payload.type !== 'websocket') {
      throw new Error('Invalid payload type for WebSocket notification');
    }

    const sendMethod = this.eventMapping[payload.target];
    if (!sendMethod) {
      throw new Error(`No handler defined for WebSocket target: ${payload.target}`);
    }

    // Call the appropriate method dynamically
    sendMethod(payload.message);
  }
}