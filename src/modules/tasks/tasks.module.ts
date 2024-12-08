import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { QuotesModule } from "../quotes/quotes.module";
import { WeatherModule } from "../weather/weather.module";
import { NotificationModule } from "../notification/notification.module";
import { SchedulerRegistry } from "@nestjs/schedule";
import { UserService } from "../user/service/user.service";
import { UserModule } from "../user/user.module";
import { HabitTrackingModule } from "../habit-tracking/habit-tracking.module";
import { HabitTrackingService } from "../habit-tracking/habit-tracking.service";
import { TracingLoggerModule } from "../tracing-logger/tracing-logger.module";

@Module({
  imports: [ QuotesModule, WeatherModule, NotificationModule, UserModule, HabitTrackingModule, TracingLoggerModule],
  providers: [
    TasksService,
    SchedulerRegistry,
  ],
})
export class TasksModule {}
