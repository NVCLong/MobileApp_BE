import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Hobby, Sport, UserSupportWorkField } from "../utils/user.constant";

export class UserInfoRequest {
  @IsArray()
  @IsNotEmpty()
  WorkFields : UserSupportWorkField[];

  @IsArray()
  @IsNotEmpty()
  Hobbies : Hobby[];

  @IsNotEmpty()
  @IsNotEmpty()
  timeUsingPhone : number;

  @IsArray()
  @IsOptional()
  SportFields?: Sport[];


  @IsNumber()
  @IsOptional()
  exerciseTimePerWeek? : number;


  @IsOptional()
  code?:string;

}