import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Injectable, Logger } from "@nestjs/common";
import { Server } from "socket.io";


@WebSocketGateway()
@Injectable()
export class NotificationGateway{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  private server: Server;

  sendDailyNotification(data:any){
    this.logger.log('Sending daily notification');
    this.server.emit('dailyNotification', data);
  }

  sendWeatherNotification(data:any){
    this.logger.log('Sending weather notification');
    this.server.emit('weatherNotification', data);
  }
}