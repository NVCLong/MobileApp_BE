import { PartialType } from '@nestjs/mapped-types';
import { CreateDefaultHabitsDto } from './create-default_habits.dto';

export class UpdateDefault_habitsDto extends PartialType(CreateDefaultHabitsDto) {}
