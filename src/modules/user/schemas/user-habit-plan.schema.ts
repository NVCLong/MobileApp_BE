import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from "./user.schema";

import { HabitType } from "../../default_habits/utils/habit.constant";

export type HabitPlanDocument = HydratedDocument<HabitPlan>;

@Schema()
export class HabitPlan {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name , required: true })
  userId: Types.ObjectId;

  @Prop({
    type: Map,
    of: {
      type: [{ type: Object }],
      default: () => ({}),
    },
    default: {},
  })
  weeklyPlan: Map<DaysOfWeek, HabitDailyPlan[]>;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: false })
  endDate?: Date;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const HabitPlanSchema = SchemaFactory.createForClass(HabitPlan);

export enum DaysOfWeek {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}


// habit daily plan is contain habit type => Custom, Default
export class HabitDailyPlan {
  type: HabitType;
  data: Types.ObjectId;
}