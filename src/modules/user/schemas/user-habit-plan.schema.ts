import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from "./user.schema";
import { UserHabitTracking } from "../../default_habits_value/schema/user-tracking-info.schema";
import { HabitType } from "../../default_habits/utils/habit.constant";

export type HabitPlanDocument = HydratedDocument<HabitPlan>;

@Schema()
export class HabitPlan {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name , required: true })
  user_id: Types.ObjectId;

  @Prop({
    type: Map,
    of: {
      type: [{ type: Object }],
      default: () => ({}),
    },
    default: {},
  })
  weekly_plan: Map<DaysOfWeek, HabitDailyPlan[]>;

  @Prop({ default: Date.now })
  start_date: Date;

  @Prop({ required: false })
  end_date?: Date;

  @Prop({ default: Date.now })
  last_updated: Date;
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

export class HabitDailyPlan {
  type: HabitType;
  data: Types.ObjectId;
}