import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { QuotesService } from './quotes.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from "../user/schemas/user.schema";
import { lastValueFrom } from "rxjs";


@Injectable()
export class QuotesSyncService {
  constructor(
    private readonly httpService: HttpService,
    private readonly quotesService: QuotesService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Sync daily quotes for all users
  async syncWeeklyQuotes() {
    try {

      const apiUrl = "https://zenquotes.io/api/random";
      const quoteData = []

      for(let i = 0; i < 7 ; i++){
        const response = await lastValueFrom(this.httpService.get(apiUrl));

        const [quote] = Array.isArray(response.data) ? response.data : [];
        if (quote && quote.q && quote.a) {
          quoteData.push({
            content: quote.q,
            author: quote.a,
            htmlContent: quote.h || null,
          });
        }
      }

      if (quoteData.length < 7) {
        console.error('Not enough valid quotes data from API.');
        return;
      }

      const quotesToUpdate = [
        {
          insertOne: {
            filter: {},
            document: {
              weeklyQuotes: quoteData,
            }
          },
        },
      ]

      // Perform bulk write to optimize database operations
      const result = await this.quotesService.bulkUpdateQuotes(quotesToUpdate);

      console.log('Daily quotes synced successfully:', result);
    } catch (error) {
      console.error('Error syncing daily quotes:', error.message);
    }
  }
}
