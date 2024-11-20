import { Body, Controller, Post } from "@nestjs/common";
import { Default_HabitsService } from "./default_habits.service";
import { CreateDefault_HabitsDto } from "./dto/create-default_habits.dto";

@Controller('default-habits')
export class DefaultHabitsController {
  constructor(private readonly habitsService: Default_HabitsService) {}

  @Post('create')
  createHabits(@Body() createDefaultHabitsDto: CreateDefault_HabitsDto) {
    this.habitsService.createDefault_Habits(createDefaultHabitsDto);
    return {
      name: createDefaultHabitsDto.name,
      type: createDefaultHabitsDto.type,
      default_score: createDefaultHabitsDto.default_score,
      category: createDefaultHabitsDto.category,
      frequency: createDefaultHabitsDto.frequency,
      goal: createDefaultHabitsDto.goal,
      package_score: createDefaultHabitsDto.package_score,
    };
  }
}
