import { Test, TestingModule } from '@nestjs/testing';
import { HabitTrackingController } from './habit-tracking.controller';
import { HabitTrackingService } from './habit-tracking.service';

describe('HabitTrackingController', () => {
  let controller: HabitTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitTrackingController],
      providers: [HabitTrackingService],
    }).compile();

    controller = module.get<HabitTrackingController>(HabitTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
