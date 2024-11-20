import { Test, TestingModule } from '@nestjs/testing';
import { DefaultHabitsValueController } from './default_habits_value.controller';

describe('DefaultHabitsValueController', () => {
  let controller: DefaultHabitsValueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DefaultHabitsValueController],
    }).compile();

    controller = module.get<DefaultHabitsValueController>(DefaultHabitsValueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
