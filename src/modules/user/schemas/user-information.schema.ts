import mongoose, { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Hobby, UserSupportWorkField } from "../utils/user.constant";
import { User } from "./user.schema";

export type UserInformationSchema= HydratedDocument<UserInformation>
@Schema()
export class UserInformation {
  @Prop({ type: [String], enum: UserSupportWorkField, required: true })
  work: UserSupportWorkField[];

  @Prop({ type: [String], enum: Hobby, required: true })
  hobbies: Hobby[];

  @Prop({ required: true })
  timeUsingPhone: number;

  @Prop({ required: false, type: [String], enum: UserSupportWorkField })
  favSport: string;

  @Prop({ required: false })
  exerciseTimePerWeek: number; // value expect 1-7 days per week

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  user: User
  _id: Types.ObjectId;
}
export const UserInformationSchema = SchemaFactory.createForClass(UserInformation)