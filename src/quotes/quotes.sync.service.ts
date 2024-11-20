import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { QuotesService } from './quotes.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from "../modules/user/schemas/user.schema";
import { lastValueFrom } from "rxjs";


@Injectable()
export class QuotesSyncService {
  constructor(
    private readonly httpService: HttpService,
    private readonly quotesService: QuotesService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Sync daily quotes for all users
  async syncDailyQuotes() {
    try {
      const users = await this.userModel.find().exec();
      if (users.length === 0) {
        console.log('No users found for daily quote sync.');
        return;
      }

      const apiUrl = 'https://zenquotes.io/api/random';
      const response = await lastValueFrom(this.httpService.get(apiUrl));

      const [quoteData] = Array.isArray(response.data) ? response.data : [];
      if (!quoteData || !quoteData.q || !quoteData.a) {
        console.error('Invalid quote data from API:', response.data);
        return;
      }

      const { q, a, h } = quoteData;

      const quotesToUpdate = users.map(user => ({
        updateOne: {
          filter: { userId: user._id.toString() },
          update: {
            content: q,
            author: a,
            htmlContent: h || null, // Use `h` if available
            userId: user._id.toString(),
          },
          upsert: true, // Create if not exists
        },
      }));

      // Perform bulk write to optimize database operations
      const result = await this.quotesService.bulkUpdateQuotes(quotesToUpdate);

      console.log('Daily quotes synced successfully:', result);
    } catch (error) {
      console.error('Error syncing daily quotes:', error.message);
    }
  }
}
