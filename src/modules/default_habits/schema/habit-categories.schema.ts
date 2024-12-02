import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Hobby, Sport, UserSupportWorkField } from "../../user/utils/user.constant";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "../../user/schemas/user.schema";
import { DefaultHabits } from "./default_habits.schema";

export type HabitCategoriesDocument = HydratedDocument<HabitCategory>
@Schema()
export class HabitCategory {
  _id: Types.ObjectId;

  @Prop({ required: true, name: "categoryName" })
  categoryName: string

  @Prop({ required: false })
  description: string

  @Prop({ required: true })
  sportFields: Sport[]

  @Prop({ required: true })
  workFields: UserSupportWorkField[]

  @Prop({ required: true })
  hobbies: Hobby[];

  @Prop({ required: true })
  categoryDescription : string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: DefaultHabits.name, required: false })
  listDefaultHabits: (Types.ObjectId | DefaultHabits)[]
}

export const HabitCategories = SchemaFactory.createForClass(HabitCategory);