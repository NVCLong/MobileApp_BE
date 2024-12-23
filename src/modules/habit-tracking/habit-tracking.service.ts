import {
  BadRequestException,
  forwardRef, Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HabitTracking, HabitTrackingDocument } from "./schema/habit.tracking.schema";
import { Model, Types } from "mongoose";
import { UserService } from "../user/service/user.service";
import { Default_HabitsService } from "../default_habits/service/default_habits.service";
import { MarkCompletedDto } from "./dto/MarkCompleted.dto";
import { BitmaskUtil } from "./utils/bitmask.util";
import { SyncHabitDTO } from "./dto/SyncHabit.dto";
import { CreateHabitTrackingDto } from "./dto/create.habitTracking.dto";
import { UpdateHabitTrackingDto } from "./dto/update.habitTracking.dto";
import * as process from "node:process";
import { UpdateStreakDTO } from "../user/dtos/updateStreak.dto";
import { DefaultHabits, HabitsDocument } from "../default_habits/schema/default_habits.schema";
import { plainToInstance } from "class-transformer";
import { DailyPlan } from "../user/dtos/get-habit-plan.response.dto";


@Injectable()
export class HabitTrackingService {
  private readonly logger = new Logger(HabitTrackingService.name);
  constructor(
    @InjectModel(HabitTracking.name) private habitTrackingModel: Model<HabitTrackingDocument>,
    @InjectModel(DefaultHabits.name) private defaultHabitModel: Model<HabitsDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly defaultHabitsService: Default_HabitsService,
  ) {}

  // async markHabitAsCompleted(markCompleted: MarkCompletedDto): Promise<string>{
  //   this.logger.debug("[MarkHabitAsCompleted] MarkHabitAsCompleted called");
  //
  //   const { habitPlanId ,habitId, userId } = markCompleted;
  //
  //   //validate habitPlan relationship
  //   const habitPlan = await this.userService.getHabitPlanById(habitPlanId);
  //   if(!habitPlan){
  //     this.logger.debug("[MarkHabitAsCompleted] Habit plan not found");
  //     throw new NotFoundException("Habit plan not found");
  //   }
  //   if(habitPlan.user_id.toString() !== userId){
  //     this.logger.debug("[MarkHabitAsCompleted] User not authorized");
  //     throw new UnauthorizedException("Habit plan not belong to user");
  //   }
  //
  //   //valit the habit exist with the habit plan
  //   const isHabitInPlan = Array.from(habitPlan.weekly_plan.values()).some((dailyHabits) =>{
  //     dailyHabits.some((habitDailyPlan) => habitDailyPlan.data.toString() === habitId);
  //   })
  //   if(!isHabitInPlan){
  //     this.logger.debug("[MarkHabitAsCompleted] Habit not in plan");
  //     throw new NotFoundException("Habit not in specified HabitPlan");
  //   }
  //
  //   //validate habit relationship with user
  //   const habit = await this.defaultHabitsService.getHabitById(habitId);
  //   if(!habit){
  //     this.logger.debug("[MarkHabitAsCompleted] Habit not found");
  //     throw new NotFoundException("Habit not found");
  //   }
  //
  //   //create new habit tracking
  //   let habitTracking = await this.habitTrackingModel.findOne({ habitPlanId, habitId, userId });
  //
  //   const today = new Date();
  //   const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  //
  //   if(!habitTracking){
  //     //initial bitmask today mark as completed
  //     habitTracking = new this.habitTrackingModel({
  //       habitPlanId: new Types.ObjectId(habitPlanId),
  //       habitId: new Types.ObjectId(habitId),
  //       userId: new Types.ObjectId(userId),
  //       progress: BitmaskUtil.initializeBitmask(),
  //       lastCompleted: todayTimestamp,
  //     })
  //   }else{
  //     //check if already completed today
  //     const dayOffset = 0; //today
  //     if(BitmaskUtil.isDayCompleted(habitTracking.progress, dayOffset)){
  //       this.logger.debug("[MarkHabitAsCompleted] Habit already completed today");
  //       return habitTracking._id.toString(); //already completed today
  //     }
  //
  //     //shift bitmask base on last completed day
  //     const lastCompletedDate = new Date(habitTracking.lastCompleted);
  //     const daySinceLastCompleted = this.calculateDiffDay(lastCompletedDate, today);
  //
  //     if(daySinceLastCompleted > 0){
  //       for(let i = 0; i < daySinceLastCompleted; i++){
  //         habitTracking.progress = BitmaskUtil.shiftBitmask(habitTracking.progress);
  //       }
  //     }
  //
  //     //mark today as completed
  //     habitTracking.progress = BitmaskUtil.markDayCompleted(habitTracking.progress, dayOffset);
  //
  //     //update streak;
  //   }
  //
  //   await habitTracking.save();
  //   return habitTracking._id.toString();
  // }


  // async syncHabit(syncHabit: SyncHabitDTO): Promise<void>{
  //   //do sth
  //   this.logger.debug("[SyncHabit] SyncHabit called");
  //   const { userId, habits} = syncHabit;
  //
  //   for( const habitSync of habits){
  //     const { habitId, completions } = habitSync;
  //
  //     //find the habitPlans include that
  //     const habitPlans = await this.userService.getHabitPlansByHabitId(habitId);
  //
  //     for(const habitPlan of habitPlans){
  //       //find the habitPlan belong to the user
  //       if(habitPlan.user_id.toString() !== userId){
  //         continue;
  //       }
  //
  //       //Find or create new habit plan
  //       let habitTracking = await this.habitTrackingModel.findOne({ habitPlanId: habitPlan._id, habitId, userId });
  //
  //       if(!habitTracking){
  //
  //         let bitmask = 0 //today
  //         const today = new Date();
  //         const todayTimestamp = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  //
  //         completions.forEach((completion) => {
  //           const dayOffset = this.calculateDiffDay( new Date(completion), today);
  //           if(dayOffset > 0 && dayOffset < 64){
  //             bitmask = BitmaskUtil.markDayCompleted(bitmask, dayOffset);
  //           }
  //         });
  //
  //         habitTracking = new this.habitTrackingModel({
  //           habitPlanId: habitPlan._id,
  //           habitId: new Types.ObjectId(habitId),
  //           userId: new Types.ObjectId(userId),
  //           progress: BitmaskUtil.initializeBitmask(),
  //           lastCompleted: completions.length > 0 ? Math.max(...completions) : undefined,
  //         })
  //       }else{
  //         //merge completions into habit tracking progress
  //
  //         let update = false;
  //         completions.forEach((completion) => {
  //           const dayOffset = this.calculateDiffDay( new Date(completion), new Date(habitTracking.lastCompleted || completion));
  //           if(dayOffset > 0 && dayOffset < 64 && !BitmaskUtil.isDayCompleted(habitTracking.progress, dayOffset)){
  //             if(!BitmaskUtil.isDayCompleted(habitTracking.progress, dayOffset)){
  //               habitTracking.progress = BitmaskUtil.markDayCompleted(habitTracking.progress, dayOffset);
  //               update = true;
  //             }
  //           }
  //         });
  //
  //         if(update){
  //
  //           habitTracking.lastCompleted = Math.max(...completions, habitTracking.lastCompleted || 0);
  //         }
  //       }
  //       await habitTracking.save();
  //     }
  //   }
  // }

  //retrieve all habit tracking data of a user
  async getHabitTracking(userId: string): Promise<HabitTrackingDocument[]>{
    return this.habitTrackingModel.find({userId}).populate('habitPlanId habitId').exec()
  }

  /**
   * Calculate the difference between two dates in days
   * @param lastCompletedDate from Day from
   * @param today from Day to
   * @private
   */
  private calculateDiffDay(lastCompletedDate: Date, today: Date): number{
    const diffTime = today.getTime() - lastCompletedDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  //calculate the streak

  //calculate the max streak


  //create for testing
  async createOrUpdateHabitTracking(
    createHabitTrackingDto: CreateHabitTrackingDto
  ): Promise<HabitTracking> {
    const { userId, habitId, progress } = createHabitTrackingDto;
    if (progress < 0) {
      throw new BadRequestException('Progress cannot be negative');
    }

    let habitTracking = await this.habitTrackingModel.findOne({ userId, habitId });
    if (!habitTracking) {
      habitTracking = new this.habitTrackingModel({ userId, habitId, progress });
    } else {
      habitTracking.progress = progress;
    }

    await habitTracking.save();
    return habitTracking;
  }

  async createHabitTracking(createDto: CreateHabitTrackingDto): Promise<HabitTracking> {
    const { userId, habitId, progress, planId } = createDto;
    const habit = await this.habitTrackingModel.create({
      userId,
      habitId,
      progress,
      planId
    })
    return habit;
  }


  async getAllHabitTrackingForPlan(userId: string, planId: string) {
    if(!userId || !planId){
      return null;
    }
    const allHabitTrackings = await this.habitTrackingModel.find({
      userId: userId,
      planId : planId
    }).exec();

    const habitIds = allHabitTrackings.map((habitTracking) => { return habitTracking.habitId});
    const relatedHabits = await this.defaultHabitModel.find({
      _id: {$in: habitIds},
    }).exec();
    const trackingIdToDailyPlan = new Map<string, DailyPlan>();
    const result = allHabitTrackings.map((tracking) => {
      const habit = relatedHabits.find((habit) => habit._id.toString() === tracking.habitId.toString());
      const dailyPlan : DailyPlan = {
        trackingId: tracking._id.toString(),
        habitName: habit.name,
        habitType: habit.type,
        defaultScore: habit.defaultScore,
        description: habit.description,
        targetUnit: habit.targetUnit,
        progress: tracking.progress,
        goal: habit.goal,
      }
      trackingIdToDailyPlan.set(tracking._id.toString(), dailyPlan);
      });

    return trackingIdToDailyPlan;
  }

  async updateUserStreak(
    updateStreakDto: UpdateStreakDTO
  ): Promise<void> {
    // No calculation, just update directly
    const { userId, currentStreak, longestStreak } = updateStreakDto;
    await this.userService.updateUserStreak(new Types.ObjectId(userId), currentStreak, longestStreak);
  }
}
