import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Quote extends Document {

  @Prop({ required: true })
  content: string; // Quote text

  @Prop({ required: true })
  author: string; // Author of the quote

  @Prop()
  htmlContent: string; // HTML content of the quote

  @Prop({ type: [String], default: [] })
  tags: string[]; // Array of tags

  @Prop({ required: true })
  authorSlug: string; // Slug of the author's name

  @Prop({ required: true })
  length: number; // Length of the quote

  @Prop({ required: true })
  dateAdded: string; // Date when the quote was added (format: YYYY-MM-DD)

  @Prop({ required: true })
  dateModified: string; // Date when the quote was last modified (format: YYYY-MM-DD)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string; // Link each quote to a user
}

export const QuotesSchema = SchemaFactory.createForClass(Quote);
