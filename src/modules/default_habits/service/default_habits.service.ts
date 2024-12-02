import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DefaultHabits } from "../schema/default_habits.schema";
import { CreateDefaultHabitsDto } from "../dto/create-default_habits.dto";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { plainToInstance } from "class-transformer";
import { validate } from "uuid";
import { HabitActionType, TargetUnit } from "../utils/habit.constant";

@Injectable()
export class Default_HabitsService {
  constructor(@InjectModel(DefaultHabits.name) private readonly defaultHabitsModel: Model<DefaultHabits>, private readonly logger: TracingLogger) {
    this.logger.setContext(Default_HabitsService.name);
  }

  async createDefaultHabits(createDefaultHabitsDtos: CreateDefaultHabitsDto[]) {
    this.logger.debug('Start to saving default habits');
    for (const createDefaultHabitsDto of createDefaultHabitsDtos) {
      if (!Object.values(HabitActionType).includes(createDefaultHabitsDto.type)) {
        this.logger.error('Have invalid action type');
        throw new BadRequestException("Invalid habits type ");
      }

      if (!Object.values(TargetUnit).includes(createDefaultHabitsDto.targetUnit)) {
        this.logger.error('have invalid target unit');
        throw new BadRequestException("Invalid target unit");
      }
      const defaultHabitsInstance = plainToInstance(DefaultHabits, createDefaultHabitsDto);
      const validationErrors = validate(defaultHabitsInstance);
      if (validationErrors) {
        throw new BadRequestException('Error for input request')
      }
      await this.defaultHabitsModel.create(defaultHabitsInstance);
    }
    return {
      status: 'success',
      message: 'Create success'
    }
  }
}
