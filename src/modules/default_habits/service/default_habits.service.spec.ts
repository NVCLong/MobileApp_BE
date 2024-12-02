import { Test, TestingModule } from '@nestjs/testing';
import { Default_HabitsService } from './default_habits.service';

describe('DefaultHabitsService', () => {
  let service: Default_HabitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Default_HabitsService],
    }).compile();

    service = module.get<Default_HabitsService>(Default_HabitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
