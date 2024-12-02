import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Quote extends Document {

  // @Prop({ required: true })
  // dateAdded: string; // Date when the quote was added (format: YYYY-MM-DD)
  //
  // @Prop({ required: true })
  // dateModified: string; // Date when the quote was last modified (format: YYYY-MM-DD)

  @Prop({ type: [{ content: String, author: String, htmlContent: String }] })
  weeklyQuotes: { content: string; author: string; htmlContent?: string }[];
}

export const QuotesSchema = SchemaFactory.createForClass(Quote);
