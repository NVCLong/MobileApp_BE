import { Test, TestingModule } from '@nestjs/testing';
import { DefaultHabitsValueService } from './default_habits_value.service';

describe('DefaultHabitsValueService', () => {
  let service: DefaultHabitsValueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DefaultHabitsValueService],
    }).compile();

    service = module.get<DefaultHabitsValueService>(DefaultHabitsValueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
