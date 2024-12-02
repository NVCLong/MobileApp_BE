import { IsNotEmpty, IsString, IsArray, IsOptional, ValidateNested, IsBoolean } from "class-validator";
import { Type } from 'class-transformer';
import { Hobby, Sport, UserSupportWorkField } from "../../user/utils/user.constant";
import { DefaultHabits } from "../schema/default_habits.schema";



export class CreateHabitCategoriesDto {
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsArray()
  sportFields?: Sport[];


  @IsArray()
  workFields?: UserSupportWorkField[];


  @IsArray()
  hobbies?: Hobby[];


  @IsString()
  categoryDescription?: string;

  @IsOptional()
  @IsArray()
  listDefaultHabitsIds?: string[];

  @IsOptional()
  @IsBoolean()
  isUpdateFull?: boolean;
}
