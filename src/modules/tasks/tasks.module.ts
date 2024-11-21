import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { QuotesModule } from "../quotes/quotes.module";
import { WeatherModule } from "../weather/weather.module";
import { NotificationModule } from "../notification/notification.module";
import { SchedulerRegistry } from "@nestjs/schedule";

@Module({
  imports: [ QuotesModule, WeatherModule, NotificationModule],
  providers: [
    TasksService,
    SchedulerRegistry,
  ],
})
export class TasksModule {}
