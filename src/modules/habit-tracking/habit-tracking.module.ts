import { Module } from '@nestjs/common';
import { HabitTrackingService } from './habit-tracking.service';
import { HabitTrackingController } from './habit-tracking.controller';

@Module({
  controllers: [HabitTrackingController],
  providers: [HabitTrackingService],
})
export class HabitTrackingModule {}
