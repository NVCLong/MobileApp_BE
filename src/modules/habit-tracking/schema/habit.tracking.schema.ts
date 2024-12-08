import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { DefaultHabits } from "../../default_habits/schema/default_habits.schema";
import { HabitPlan } from "../../user/schemas/user-habit-plan.schema";

export type HabitTrackingDocument = HabitTracking & Document;

@Schema({ timestamps: true })
export class HabitTracking {
  // @Prop({type: Types.ObjectId, ref: HabitPlan.name ,required: true})
  // habitPlanId: Types.ObjectId;

  _id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  habitId : MongooseSchema.Types.ObjectId;

  @Prop({type: Types.ObjectId,required: true})
  userId: Types.ObjectId;

  @Prop({ required: true, default: 0 }) // Hexadecimal string for 64-bit bitmask
  progress: number; //progress in 63 days max

  // @Prop({required: false})
  // lastCompleted?: number; // timestamp
}

export const HabitTrackingSchema = SchemaFactory.createForClass(HabitTracking);