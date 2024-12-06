import { CreateHabitTrackingDto } from "./create.habitTracking.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateHabitTrackingDto extends PartialType(CreateHabitTrackingDto) {
}