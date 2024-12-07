import { Expose, Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { toBoolean } from "../../../common/utils";

export class UpdateConfigsRequest {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  settingValue: string;

  @Expose()
  @IsString()
  dataType: string;

  @IsOptional()
  @Transform(({value}) => toBoolean(value))
  isActive?: boolean
}