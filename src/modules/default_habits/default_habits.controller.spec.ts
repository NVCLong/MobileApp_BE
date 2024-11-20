import { Test, TestingModule } from '@nestjs/testing';
import { DefaultHabitsController } from './default_habits.controller';

describe('DefaultHabitsController', () => {
  let controller: DefaultHabitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefaultHabitsController],
    }).compile();

    controller = module.get<DefaultHabitsController>(DefaultHabitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
