import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";


export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop({ required: true })
  userName: string;
  @Prop({required: true})
  userEmail: string;
  @Prop({required: false})
  age: number;

  @Prop({default: 0})
  currentStreak: number;

  @Prop({default: 0})
  longestStreak: number;

  _id: Types.ObjectId;

  @Prop({required: false})
  loginCode?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);