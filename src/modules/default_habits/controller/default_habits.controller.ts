import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Default_HabitsService } from "../service/default_habits.service";
import { CreateDefaultHabitsDto } from "../dto/create-default_habits.dto";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { InternalApiGuard } from "../../../shared/internal-api.guard";
import { HabitCategoriesService } from "../service/habit-categories.service";
import { CreateHabitCategoriesDto } from "../dto/create-default-categories.request.dto";

@Controller('default-habits')
export class DefaultHabitsController {
  constructor(
    private readonly habitsService: Default_HabitsService,
    private  readonly logger: TracingLogger,
    private readonly categoryService: HabitCategoriesService
  ) {
    this.logger.setContext(DefaultHabitsController.name);
  }

  @Post('create')
  async createHabits(@Body() createDefaultHabitsDtos: CreateDefaultHabitsDto[]) {
    try {
      return await this.habitsService.createDefaultHabits(createDefaultHabitsDtos);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Failed to create default habit. Please try again later.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(InternalApiGuard)
  @Post('updateCategories')
  async createCategories(@Body() request: CreateHabitCategoriesDto) {
    try{
      return this.categoryService.updateCategories(request)
    }catch (err){
      throw new Error(err);
    }
  }

}
