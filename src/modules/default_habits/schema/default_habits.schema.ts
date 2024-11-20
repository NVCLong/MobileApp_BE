import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type HabitsDocument = HydratedDocument<Default_Habits>

@Schema()
export class Default_Habits {
  @Prop({ default: uuidv4 })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop({default: 10})
  default_score: number;

  @Prop()
  category: string;

  @Prop()
  frequency: number;

  @Prop()
  goal: number;

  @Prop({default: 10})
  package_score: number;

}

export const Default_habitsSchema = SchemaFactory.createForClass(Default_Habits);