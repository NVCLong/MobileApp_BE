import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Default_Habits } from "./schema/default_habits.schema";
import { CreateDefault_HabitsDto } from "./dto/create-default_habits.dto";

@Injectable()
export class Default_HabitsService {
  constructor(@InjectModel(Default_Habits.name) private Default_HabitsModel: Model<Default_Habits>) {}

  async createDefault_Habits(createDefault_HabitsDto: CreateDefault_HabitsDto) {
    console.log(createDefault_HabitsDto)
    const createdHabits = new this.Default_HabitsModel(createDefault_HabitsDto);
    console.log(createdHabits)
    return createdHabits.save();
  }
}
