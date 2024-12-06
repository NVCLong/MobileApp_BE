import { Module } from '@nestjs/common';
import { DefaultHabitsController } from './controller/default_habits.controller';
import { Default_HabitsService } from './service/default_habits.service';
import { MongooseModule } from "@nestjs/mongoose";
import { DefaultHabits, Default_habitsSchema } from "./schema/default_habits.schema";
import { HabitCategories, HabitCategory } from "./schema/habit-categories.schema";
import { HabitCategoriesService } from "./service/habit-categories.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: DefaultHabits.name, schema: Default_habitsSchema }, {name: HabitCategory.name, schema: HabitCategories}])],
  controllers: [DefaultHabitsController],
  providers: [Default_HabitsService, HabitCategoriesService],
  exports: [Default_HabitsService]
})
export class DefaultHabitsModule {}
