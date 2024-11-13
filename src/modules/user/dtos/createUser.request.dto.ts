import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateUserRequestDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNumber()
  @Min(0, {message: "Age must be greater than or equal to 0"})
  age?: number;
}