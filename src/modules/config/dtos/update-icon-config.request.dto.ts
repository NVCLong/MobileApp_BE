import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class UpdateIconConfigRequest {
  @Expose()
  @IsNotEmpty()
  settingName: string;

  @Expose()
  settingValues: IconConfigItem[];
}

export class IconConfigItem {
  fieldName: string;
  icon: string;
}