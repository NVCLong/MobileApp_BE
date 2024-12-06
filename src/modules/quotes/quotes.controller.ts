import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { QuotesService } from './quotes.service';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get('latest')
  async getLatestQuotes(@Query('limit') limit: string) {

    const limitNumber = parseInt(limit, 10);
    if (isNaN(limitNumber)) {
      throw new BadRequestException('Limit must be a number');
    }
    const quotes = await this.quotesService.getLatestQuotes(limitNumber);
    return quotes;
  }
}
