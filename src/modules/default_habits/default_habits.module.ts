import { Module } from '@nestjs/common';
import { DefaultHabitsController } from './default_habits.controller';
import { Default_HabitsService } from './default_habits.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Default_Habits, Default_habitsSchema } from "./schema/default_habits.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Default_Habits.name, schema: Default_habitsSchema }])],
  controllers: [DefaultHabitsController],
  providers: [Default_HabitsService]
})
export class DefaultHabitsModule {}
