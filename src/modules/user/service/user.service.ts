import { BadRequestException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "../schemas/user.schema";
import { Model, Types } from "mongoose";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserRequestDTO } from "../dtos/createUser.request.dto";
import { EmailValidationHelper } from "../../email-validation/service/email-validation.helper";
import { plainToInstance } from "class-transformer";
import { CreateUserResult } from "../dtos/createUser.resposne.dto";
import { UserInfoRequest } from "../dtos/user-information.request.dto";
import { UserInformation } from "../schemas/user-information.schema";
import { Hobby, Sport, UserSupportWorkField } from "../utils/user.constant";
import { GetUserInfoResponse } from "../dtos/get-user-info.response.dto";
import { HabitCategory } from "../../default_habits/schema/habit-categories.schema";
import { DefaultHabits } from "../../default_habits/schema/default_habits.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserInformation.name) private readonly userInformationModel: Model<UserInformation>,
    @InjectModel(HabitCategory.name) private readonly habitCategoryModel: Model<HabitCategory>,
    private readonly logger: TracingLogger,
    private readonly emailValidationHelper: EmailValidationHelper,
  ) {
    this.logger.setContext(UserService.name)
  }

  async createUser(request: CreateUserRequestDTO){
    this.logger.debug("[CreateUser] CreateUser called]")
    const { name, email, age} = request
    if(!name || !email){
      this.logger.debug("[CreateUser] Do not have enough information");
      throw new BadRequestException("Missing required fields")
    }
    const result = await  this.emailValidationHelper.validateEmail(email);
    if(!result){
      this.logger.debug("[CreateUser] Email validation failed");
      throw new BadRequestException("Email validation failed");
    }
    this.checkExistEmail(email);
    const res= await this.userModel.create({
      userName: request.name,
      userEmail: request.email,
      age: request.age,
    })

    //TODO
    // add notification when user register success
    
    return plainToInstance(CreateUserResult,{
      userId: res.id,
      status: HttpStatus.CREATED
    })
  }

  private checkExistEmail(email){
    this.logger.debug("[CheckExistEmail] CheckExistEmail called");
    const user = this.userModel.findOne({userEmail:email});
    if(!user){
      this.logger.debug("[CheckExistEmail] User not found and email does not exist");
    }
    throw new BadRequestException("Email validation failed - Email is used by another user");
  }

  async updateUserInformation(request: UserInfoRequest, userId: number){
     this.logger.debug("[UpdateUserInformation] UpdateUserInformation called");
     const sportSupportTypes= Object.values(Sport).filter((value)=> typeof value === "string");
     const workFieldsTypes = Object.values(UserSupportWorkField).filter((value)=> typeof value === 'string')
     const hobbiesTypes = Object.values(Hobby).filter((value)=> typeof value === 'string');
     const checkInputFavSport = request.favSport?.every((sport) =>{
       return sportSupportTypes.includes(sport);
     })
    const checkInputWorkFields = request.userWorkFields?.every((value)=>{
      return workFieldsTypes.includes(value);
    })
    const checkInputHobbies = request.userHobbies?.every((value)=>{
      return hobbiesTypes.includes(value);
    })
    if(!checkInputWorkFields || !checkInputHobbies || !checkInputFavSport){
      throw new BadRequestException("Invalid sport type support");
    }
    const userInformation = await this.userInformationModel.findOne({user: userId})
    const updateData: any = {};

    if (request.favSport) updateData.favSport = request.favSport;
    if (request.timeUsingPhone) updateData.timeUsingPhone = request.timeUsingPhone;
    if (request.exerciseTimePerWeek) updateData.exerciseTimePerWeek = request.exerciseTimePerWeek;
    if (request.userHobbies) updateData.hobbies = request.userHobbies;
    if (request.userWorkFields) updateData.work = request.userWorkFields;

    if (userInformation) {
      return this.userInformationModel.updateOne({ user: userId }, { $set: updateData });
    }
     return await this.userInformationModel.create({
       user: userId,
       favSport: request.favSport || [],
       timeUsingPhone: request.timeUsingPhone,
       exerciseTimePerWeek: request.exerciseTimePerWeek || 0,
       work: request.userWorkFields || [],
       hobbies: request.userHobbies || []
     });
  }

  async getUserInformation(userId: string){
    this.logger.debug("[GetUserInformation] GetUserInformation called");
    const fullUserInfo = await  this.userInformationModel.findOne({user: userId}).populate('user').exec();
    if(!fullUserInfo){
      this.logger.debug("[GetUserInformation] No data found for this userId");
      return null;
    }
    return plainToInstance(GetUserInfoResponse, {
      userId: fullUserInfo.user._id,
      userName: fullUserInfo.user.userName,
      userEmail: fullUserInfo.user.userEmail,
      userWorkFields: fullUserInfo.work,
      userHobbies: fullUserInfo.hobbies,
      userFavSport: fullUserInfo.favSport,
      userUsingPhone: fullUserInfo.exerciseTimePerWeek,
      userExerciseTimePerWeek: fullUserInfo.exerciseTimePerWeek
    })
  }

  async createHabitPlanByUserInfo(userId: string){
    this.logger.debug(`[GetHabitByUserInfo] with userId = [${userId}] called`);
    const userInfo = await  this.userInformationModel.findOne({user: userId}).populate('user').exec();
    const habitCategories = await this.habitCategoryModel.find().populate({
      path: 'listDefaultHabits',
      model: DefaultHabits.name,
    })
      .exec();;
    if(!userInfo){
      throw new BadRequestException("User not found");
    }
    if(habitCategories.length === 0){
      throw new BadRequestException("No data found any habit categories");
    }
    this.logger.debug(`Found user information with userId = [${userId}]`);
    const { work, favSport, hobbies, exerciseTimePerWeek, timeUsingPhone}= userInfo;
    if(work && hobbies){
      this.logger.debug(`Found user information with work = [${JSON.stringify(work)}]`);
      this.logger.debug(`Found user information with hobbies = [${JSON.stringify(hobbies)}]`);
      habitCategories.sort((a, b)=>{
        this.logger.debug(`Compare [${a.categoryName}] and [${b.categoryName}]`);
        const countWorkFieldsA = a.workFields.filter((item) => work.includes(item)).length;
        const countWorkFieldsB = b.workFields.filter((item) => work.includes(item)).length;
        const countHobbiesA = a.hobbies.filter((item) => hobbies.includes(item)).length;
        const countHobbiesB = b.hobbies.filter((item) => hobbies.includes(item)).length;
        this.logger.debug(`Match workFields of item [${a.categoryName}] have work field count = ${countWorkFieldsA} and hobbies count = ${countHobbiesA}`);
        this.logger.debug(`Match workFields of item [${b.categoryName}] have work field count = ${countWorkFieldsB} and hobbies count = ${countHobbiesB}`);
        const comparePointsA = countWorkFieldsA + countHobbiesA;
        const comparePointsB = countHobbiesB + countHobbiesB;
        return comparePointsA - comparePointsB;
      });
    }
    // logic get habits by order of matching with user info
    // each day have 1 -> 2 habit pick from list habit order
    // user need to accept the plan for showing  these habits
    // if user not accept show empty list
    // if user change info => need user confirm a plan again to re-generate a plan
    const planCreationData = await this.getPlanCreationNecessaryData(habitCategories, userId);

    return habitCategories;
  }

  private async getPlanCreationNecessaryData(habitCategories: HabitCategory[], userId: string){
    const objectIdToHabitMap = new Map<Types.ObjectId, DefaultHabits | Types.ObjectId>();
    habitCategories.forEach((category)=>{
      category.listDefaultHabits.forEach(defaultHabit=>{
        objectIdToHabitMap.set(defaultHabit._id, defaultHabit);
      })
    });
    return {
      objectIdToHabitMap
    }
  }

  private getLastPlan(userId: string){

  }
}