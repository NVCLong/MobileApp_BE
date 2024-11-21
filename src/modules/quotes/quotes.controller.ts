import { Controller, Get, Param } from "@nestjs/common";
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get(':userId')
  async getDailyQuote(@Param('userId') userId: string) {
    const quote = await this.quotesService.getUserDailyQuote(userId);
    if (!quote) {
      return { message: 'No daily quote available for this user.' };
    }
    return quote;
  }
}
