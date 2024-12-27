import { Expose } from "class-transformer";
import { HabitActionType, TargetUnit } from "../../default_habits/utils/habit.constant";


export class Plan{
  monday : DailyPlan[];
  tuesday : DailyPlan[];
  wednesday : DailyPlan[];
  thursday : DailyPlan[];
  friday : DailyPlan[];
  saturday : DailyPlan[];
}

export class DailyPlan {
  trackingId: string;
  habitName: string;
  habitType: HabitActionType;
  defaultScore: number;
  description: string;
  goal: number;
  targetUnit: TargetUnit;
  progress: number;
  icon?: string;
}

export class GetHabitPlanResponse {

  @Expose()
  planId: string;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;

  @Expose()
  dailyPlans : Plan;
}
