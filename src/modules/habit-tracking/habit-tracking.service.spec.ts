import { Test, TestingModule } from '@nestjs/testing';
import { HabitTrackingService } from './habit-tracking.service';

describe('HabitTrackingService', () => {
  let service: HabitTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitTrackingService],
    }).compile();

    service = module.get<HabitTrackingService>(HabitTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
