import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { HabitActionType, HabitType, TargetUnit } from "../utils/habit.constant";

export type HabitsDocument = HydratedDocument<DefaultHabits>

@Schema()
export class DefaultHabits {

  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  type: HabitActionType;

  @Prop({default: 0})
  defaultScore: number;

  @Prop({required: false})
  description: string;

  @Prop()
  frequency: number;

  @Prop()
  goal: number;

  @Prop({required: false})
  targetUnit: TargetUnit;
}

export const Default_habitsSchema = SchemaFactory.createForClass(DefaultHabits);