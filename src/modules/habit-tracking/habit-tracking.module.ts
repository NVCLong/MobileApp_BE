import { forwardRef, Module } from "@nestjs/common";
import { HabitTrackingService } from './habit-tracking.service';
import { HabitTrackingController } from './habit-tracking.controller';
import { HabitTracking, HabitTrackingSchema } from "./schema/habit.tracking.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "../user/user.module";
import { DefaultHabitsModule } from "../default_habits/default_habits.module";
import { Default_habitsSchema, DefaultHabits } from "../default_habits/schema/default_habits.schema";
import { Configs, ConfigSchema } from "../config/schema/config.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: HabitTracking.name, schema: HabitTrackingSchema }, {name: DefaultHabits.name, schema: Default_habitsSchema},
      { name: Configs.name, schema: ConfigSchema}]),
    forwardRef(()=> UserModule),
    DefaultHabitsModule
  ],
  controllers: [HabitTrackingController],
  providers: [HabitTrackingService],
  exports: [HabitTrackingService]
})
export class HabitTrackingModule {}
