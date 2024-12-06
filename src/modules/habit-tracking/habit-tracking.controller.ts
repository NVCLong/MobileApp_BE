import { Body, Controller, Get, Patch, Post, Request, UnauthorizedException } from "@nestjs/common";
import { HabitTrackingService } from "./habit-tracking.service";
import { MarkCompletedDto } from "./dto/MarkCompleted.dto";
import { SyncHabitDTO } from "./dto/SyncHabit.dto";
import { CreateDefaultHabitsDto } from "../default_habits/dto/create-default_habits.dto";
import { CreateHabitTrackingDto } from "./dto/create.habitTracking.dto";
import { Types } from "mongoose";
import { UpdateStreakDTO } from "../user/dtos/updateStreak.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('habit-tracking')
@Controller("habit-tracking")
export class HabitTrackingController {
  constructor(private readonly habitTrackingService: HabitTrackingService) {
  }


  // @Post('complete')
  // async markHabitAsCompleted(@Body() markCompleted: MarkCompletedDto){
  //   // if(markCompleted.userId !== req.user.id){
  //   //   throw new UnauthorizedException("User not authorized");
  //   // }
  //
  //   const habitTrackingId = await this.habitTrackingService.markHabitAsCompleted(markCompleted);
  //   return {success: true, data: habitTrackingId};
  // }
  //
  // @Patch('sync')
  // async syncHabit(@Body() syncHabitDto: SyncHabitDTO, @Request() req){
  //   if(syncHabitDto.userId !== req.user.id){
  //     throw new UnauthorizedException("User not authorized");
  //   }
  //   await this.habitTrackingService.syncHabit(syncHabitDto);
  //   return {success: true, data: "Habit synchronized successfully"};
  // }
  //
  // @Get()
  // async getHabitTracking(@Request() req){
  //   const habitTrackings = await this.habitTrackingService.getHabitTracking(req.user.id);
  //   return {success: true, data: habitTrackings};
  // }

  @ApiOperation({ summary: "Create or update habit tracking" })
  @ApiResponse({ status: 201, description: "The habit tracking has been successfully created/updated." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiBody({
    type: CreateHabitTrackingDto,
    examples: {
      example1: {
        summary: 'Example habit tracking',
        value: {
          userId: '6734d1e07ccad880d3478eda',
          habitId: '6744a0cd0434866afa86e245',
          progress: 1,
        }
      }
    }
  })
  @Post(`create`)
  async createHabitTracking(@Body() createHabitTrackingDto: CreateHabitTrackingDto) {
    const habitTracking = await this.habitTrackingService.createOrUpdateHabitTracking(createHabitTrackingDto);
    return { success: true, data: habitTracking };
  }


  @ApiOperation({ summary: 'Update user streak' })
  @ApiResponse({ status: 200, description: 'User streak updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: UpdateStreakDTO,
    examples: {
      example1: {
        summary: 'Example update streak',
        value: {
          userId: '6734d1e07ccad880d3478eda',
          currentStreak: 5,
          longestStreak: 7
        }
      }
    }
  })
  @Post("update-streak")
  async updateStreak(
    @Body() updateStreakDto: UpdateStreakDTO
  ) {
    // Directly update user streaks as provided, no calculation here
    await this.habitTrackingService.updateUserStreak(updateStreakDto);

    return { success: true, message: "User streak updated successfully." };
  }
}
