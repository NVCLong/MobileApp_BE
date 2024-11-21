import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Quote } from "./quotes.schema";
import { Model } from "mongoose";

@Injectable()
export class QuotesService {
  constructor(@InjectModel(Quote.name) private readonly quoteModel: Model<Quote>) {}

  // Fetch a daily quote for a specific user
  async getUserDailyQuote(userId: string): Promise<Quote | null> {
    return this.quoteModel.findOne({ userId }).exec();
  }

  // Create or update a daily quote for a user
  async updateUserDailyQuote(userId: string, quoteData: Partial<Quote>) {
    return this.quoteModel.updateOne(
      { userId }, // Match user-specific quote
      { ...quoteData, userId },
      { upsert: true }, // Create if not exists
    );
  }

  // Bulk update quotes for multiple users
  async bulkUpdateQuotes(operations: any[]) {
    return this.quoteModel.bulkWrite(operations);
  }
}
