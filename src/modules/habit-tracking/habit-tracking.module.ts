import { Module } from '@nestjs/common';
import { HabitTrackingService } from './habit-tracking.service';
import { HabitTrackingController } from './habit-tracking.controller';
import { HabitTracking, HabitTrackingSchema } from "./schema/habit.tracking.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "../user/user.module";
import { DefaultHabitsModule } from "../default_habits/default_habits.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HabitTracking.name, schema: HabitTrackingSchema }]),
    UserModule,
    DefaultHabitsModule
  ],
  controllers: [HabitTrackingController],
  providers: [HabitTrackingService],
  exports: [HabitTrackingService]
})
export class HabitTrackingModule {}
