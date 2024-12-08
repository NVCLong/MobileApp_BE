import { DaysOfWeek } from "../schemas/user-habit-plan.schema";
import { HabitTracking } from "../../habit-tracking/schema/habit.tracking.schema";

export class UserPlanDto{
  id:string;
  dailyDtos : DailyPlanResponseDto[];
  startTime: string;
  endTime: string;
}
export class DailyPlanResponseDto {
  day : DaysOfWeek;
  listHabitTracking: HabitTracking[]
}