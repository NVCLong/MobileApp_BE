import { PartialType } from '@nestjs/mapped-types';
import { CreateDefault_HabitsDto } from './create-default_habits.dto';

export class UpdateDefault_habitsDto extends PartialType(CreateDefault_HabitsDto) {}
