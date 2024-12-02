import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { HabitActionType, HabitType, TargetUnit } from "../utils/habit.constant";

export class CreateDefaultHabitsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(HabitActionType)
  type: HabitActionType;

  @IsNumber()
  default_score: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  frequency: number;

  @IsNotEmpty()
  @IsNumber()
  goal: number;

  @IsOptional()
  @IsEnum(TargetUnit)
  targetUnit?: TargetUnit;
}