import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from "../../user/schemas/user.schema";
import { DefaultHabits } from "../../default_habits/schema/default_habits.schema";

export type UserHabitTrackingDocument = HydratedDocument<UserHabitTracking>;

@Schema()
export class UserHabitTracking {

  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name,  required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: DefaultHabits.name, required: true })
  habit_id: Types.ObjectId;

  // each week have 1 plan and new week will trigger and create new plan for this week

  @Prop({ type: Types.ObjectId, ref: 'User_Week_Plan',  required: true })
  habitPlan: Types.ObjectId;

  @Prop({ default: 0 })
  progress: number;  // progress base on goal = default + progress

  @Prop({ default: 'ongoing' })
  status: string;   // fail, success, ongoing

  @Prop({ required: false})
  customGoal?: number;

  @Prop({ default: Date.now })
  updateTime: Date;
}

export const UserHabitTrackingSchema = SchemaFactory.createForClass(UserHabitTracking);
