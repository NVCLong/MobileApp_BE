import { Module } from '@nestjs/common';
import { DefaultHabitsValueController } from './default_habits_value.controller';
import { DefaultHabitsValueService } from './default_habits_value.service';

@Module({
  controllers: [DefaultHabitsValueController],
  providers: [DefaultHabitsValueService]
})
export class DefaultHabitsValueModule {}
