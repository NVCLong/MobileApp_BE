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

  _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);