import { Controller } from '@nestjs/common';
import { HabitTrackingService } from './habit-tracking.service';

@Controller('habit-tracking')
export class HabitTrackingController {
  constructor(private readonly habitTrackingService: HabitTrackingService) {}
}
