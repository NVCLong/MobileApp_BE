import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { Default_HabitsService } from "./default_habits.service";
import { CreateDefault_HabitsDto } from "./dto/create-default_habits.dto";

@Controller('default-habits')
export class DefaultHabitsController {
  constructor(private readonly habitsService: Default_HabitsService) {}

  @Post('create')
  async createHabits(@Body() createDefaultHabitsDto: CreateDefault_HabitsDto) {
    try {
      // Attempt to create default habits in the service
      await this.habitsService.createDefault_Habits(createDefaultHabitsDto);

      // Return the success response
      return {
        message: "Default habit created successfully",
        habit: {
          name: createDefaultHabitsDto.name,
          type: createDefaultHabitsDto.type,
          default_score: createDefaultHabitsDto.default_score,
          category: createDefaultHabitsDto.category,
          frequency: createDefaultHabitsDto.frequency,
          goal: createDefaultHabitsDto.goal,
          package_score: createDefaultHabitsDto.package_score,
        },
      };
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error creating default habit:", error.message);

      // Throw a meaningful HTTP exception with a proper status code
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: "Failed to create default habit. Please try again later.",
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
