import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Hobby, Sport, UserSupportWorkField } from "../utils/user.constant";

export class UserInfoRequest {
  @IsArray()
  @IsNotEmpty()
  userWorkFields : UserSupportWorkField[];

  @IsArray()
  @IsNotEmpty()
  userHobbies : Hobby[];

  @IsNotEmpty()
  @IsNotEmpty()
  timeUsingPhone : number;

  @IsArray()
  @IsOptional()
  favSport?: Sport[];


  @IsNumber()
  @IsOptional()
  exerciseTimePerWeek? : number;

}