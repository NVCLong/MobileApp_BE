import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HabitCategories, HabitCategory } from "../schema/habit-categories.schema";
import { Model, Types } from "mongoose";

import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { CreateHabitCategoriesDto } from "../dto/create-default-categories.request.dto";
import { DefaultHabits } from "../schema/default_habits.schema";

@Injectable()
export class HabitCategoriesService  {
  constructor(
    @InjectModel(HabitCategory.name) private readonly habitCategoryModel: Model<HabitCategory>,
    private readonly logger: TracingLogger,
    @InjectModel(DefaultHabits.name) private readonly defaultHabitsModel: Model<DefaultHabits>,
  ) {
    this.logger.setContext(HabitCategoriesService.name);
  }

  async updateCategories(updateRequest: CreateHabitCategoriesDto){
    if(!updateRequest?.categoryName){
      throw new BadRequestException('Missing category name')
    }
    const category = await this.habitCategoryModel.findOne({ categoryName: updateRequest.categoryName})
    if(category){
      this.logger.debug('Found Category')
      if(updateRequest.isUpdateFull){
        return await this.processUpdateFull(updateRequest,updateRequest.categoryName);
      }
      return await this.processUpdateCategories(updateRequest, category);
    }
    const habits: DefaultHabits[] = [];
    if(updateRequest?.listDefaultHabitsIds.length >0){
      for (let habitId of updateRequest.listDefaultHabitsIds){
        const queryResults = await  this.defaultHabitsModel.findById(habitId);
        if(queryResults){
          habits.push(queryResults)
        }
      }
    }
    let habitIds: Types.ObjectId[] = [];
    if(habits.length >0){
      habitIds = habits.map(habit => new Types.ObjectId(habit._id));
    }
    this.logger.debug(`Total found ${habits.length} habits found.`);
    return this.habitCategoryModel.create({
      categoryName: updateRequest.categoryName,
      sportFields: updateRequest.sportFields,
      hobbies: updateRequest.hobbies,
      workFields: updateRequest.workFields,
      listDefaultHabits: habitIds,
      categoryDescription: updateRequest.categoryDescription,
    })
  }

  async processUpdateCategories(updateRequest: CreateHabitCategoriesDto, category: HabitCategory){
    const workFields = updateRequest.workFields;
    const hobbies = updateRequest.hobbies;
    const sports = updateRequest.sportFields;
    // case 1: update full, just remove update and update new one
    // case 2: is
    if(workFields.length > 0){
      category.workFields.push(...workFields);
    }

    if(hobbies.length > 0){
      category.hobbies.push(...hobbies);
    }

    if(sports.length > 0){
      category.sportFields.push(...sports)
    }

    if(updateRequest.categoryDescription){
      category.description = updateRequest.categoryDescription;
    }

    if(updateRequest?.listDefaultHabitsIds.length >0){
      const habits : DefaultHabits[] = [];
      for (let habitId of updateRequest.listDefaultHabitsIds){
        const queryResults = await  this.defaultHabitsModel.findById(habitId);
        const newHabits = category.listDefaultHabits.includes(queryResults._id);
        if(queryResults && !newHabits){
          habits.push(queryResults)
        }
      }
      let habitIds: Types.ObjectId[] = [];
      if(habits.length >0){
        habitIds = habits.map(habit => new Types.ObjectId(habit._id));
      }
      category.listDefaultHabits.push(...habitIds);
    }
    return this.habitCategoryModel.updateOne(
      {_id: category._id},
        {$set: category},
      {new: true}
    )
  }

  async processUpdateFull(updateRequest: CreateHabitCategoriesDto, categoryName: string){
    const habits : Types.ObjectId[] = [];
    if(updateRequest?.listDefaultHabitsIds.length >0){
      for (let habitId of updateRequest.listDefaultHabitsIds){
        const queryResults = await  this.defaultHabitsModel.findById(habitId);
        if(queryResults){
          habits.push(queryResults._id)
        }
      }
    }
    const updatedCategoryData = {
      workFields: updateRequest.workFields,
      hobbies: updateRequest.hobbies,
      sportFields: updateRequest.sportFields,
      listDefaultHabits: habits,
      categoryDescription: updateRequest.categoryDescription,
    };
    return this.habitCategoryModel.updateOne(
      { categoryName: categoryName },
      { $set: updatedCategoryData }
    );
  }
}