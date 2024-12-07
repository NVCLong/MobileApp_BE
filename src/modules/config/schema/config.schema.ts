import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { DefaultHabits } from "../../default_habits/schema/default_habits.schema";

export type ConfigDocument = HydratedDocument<Configs>
@Schema()
export class Configs {
  @Prop({ required: true })
  configName: string

  @Prop({ required: true, type: Object })
  configValue: any;

  @Prop({ required: true, default: true })
  isActive: boolean
}

export const ConfigSchema = SchemaFactory.createForClass(Configs);