import { BadRequestException, HttpStatus, Injectable } from "@nestjs/common";
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
import { DaysOfWeek, HabitDailyPlan, HabitPlan } from "../schemas/user-habit-plan.schema";
import { Configs } from "../../config/schema/config.schema";
import { HabitType, maximumHabit } from "../../default_habits/utils/habit.constant";
import { HabitTrackingService } from "../../habit-tracking/habit-tracking.service";
import { isDefaultHabits } from "../utils/user.utils";
import { EmailNotificationService } from "../../notification/services/mail.service";
import { CheckCodeRequestDto } from "../dtos/check-code-request.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(UserInformation.name) private readonly userInformationModel: Model<UserInformation>,
    @InjectModel(HabitCategory.name) private readonly habitCategoryModel: Model<HabitCategory>,
    @InjectModel(HabitPlan.name) private readonly habitPlanModel: Model<HabitPlan>,
    @InjectModel(Configs.name) private readonly configsModel: Model<Configs>,
    private readonly  habitTrackingService: HabitTrackingService,
    private readonly logger: TracingLogger,
    private readonly emailValidationHelper: EmailValidationHelper,
    private readonly emailNotificationService: EmailNotificationService,

  ) {
    this.logger.setContext(UserService.name)
  }

  async loginUser(request: CreateUserRequestDTO){
    this.logger.debug("[CreateUser] CreateUser called]")
    const { name, email, age} = request
    this.logger.debug(name + email);
    if(!name || !email){
      this.logger.debug("[CreateUser] Do not have enough information");
      throw new BadRequestException("Missing required fields")
    }
    const result = await  this.emailValidationHelper.validateEmail(email);
    if(!result){
      this.logger.debug("[CreateUser] Email validation failed");
      throw new BadRequestException("Email validation failed");
    }
    const user = await this.checkExistEmail(email);
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    if(user){
      if(user.userName !== request.name){
        this.logger.log(`User name not match with existed user`);
        throw new BadRequestException('User name not match with existed user')
      }
      user.loginCode = randomCode.toString();
      await this.emailNotificationService.sendEmailNotification(user.userEmail, randomCode.toString());
      await user.save()
      return plainToInstance(CreateUserResult,{
        userId: user.id,
        status: HttpStatus.CREATED
      })
    }
    const res= await this.userModel.create({
      userName: request.name,
      userEmail: request.email,
      age: request.age,
      loginCode: randomCode.toString(),
    })
    await this.emailNotificationService.sendEmailNotification(res.userEmail, randomCode.toString());

    return plainToInstance(CreateUserResult,{
      userId: res.id,
      status: HttpStatus.CREATED
    })
  }

  async getUserById(userId: string): Promise<User> {
    this.logger.debug("[GetUserById] GetUserById called");
    const user = await this.userModel.findById(userId);

    if(!user){
      throw new BadRequestException("User not found");
    }
    return user;
  }

  private async checkExistEmail(email: string) {
    this.logger.debug("[CheckExistEmail] CheckExistEmail called")
    return this.userModel.findOne({userEmail:email});
  }

  async updateUserInformation(request: UserInfoRequest, userId: string){
     this.logger.debug("[UpdateUserInformation] UpdateUserInformation called");
     const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId)})
     // if enter code => login code will "", out of time login code = null
    //if code is missing => update infor and expect user already submit code
    if (user.loginCode !== "") {
      throw new BadRequestException("User do not enter login code first");
    }
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
    if(!checkInputWorkFields || !checkInputHobbies){
      throw new BadRequestException("Invalid type support");
    }
    if(request.favSport && !checkInputFavSport){
      throw new BadRequestException("Invalid type support");
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
       userEmail: user.userEmail,
       userName: user.userName,
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
    // if code correct reset code
    if(!fullUserInfo || fullUserInfo.user.loginCode !== ""){
      this.logger.debug("[GetUserInformation] No data found for this userId");
      return null;
    }
    const today = new Date();
    this.logger.debug(`Query plan for ${today}`);
    const userPlans = await this.habitPlanModel.find({userId: new Types.ObjectId(userId)});
    const currentPlan = userPlans.find((plan) => {
      return plan.endDate > today && plan.startDate <= today;
    })

    return plainToInstance(GetUserInfoResponse, {
      userId: fullUserInfo.user._id,
      userName: fullUserInfo.user.userName,
      userEmail: fullUserInfo.user.userEmail,
      userWorkFields: fullUserInfo.work,
      userHobbies: fullUserInfo.hobbies,
      userFavSport: fullUserInfo.favSport,
      userUsingPhone: fullUserInfo.exerciseTimePerWeek,
      userExerciseTimePerWeek: fullUserInfo.exerciseTimePerWeek,
      weekPlanId: currentPlan ? currentPlan._id : null,
    })
  }

  async checkAccessCode(userId: string, requestCode: string) {
    this.logger.debug("[CheckAccessCode] CheckAccessCode called "+ userId + " "+requestCode);
    if(!userId || !requestCode) {
      throw new BadRequestException('Missing required fields');
    }
    const user = await this.userModel.findOne({_id: userId});
    if (!user?.loginCode) {
      throw new BadRequestException("Code expired");
    }
    if(user?.loginCode === ""){
      this.logger.debug(`User already enter code`)
      return;
    }
    if (user?.loginCode !== requestCode) {
      throw new BadRequestException("Invalid login Code");
    }
    this.logger.debug(`User access Code: ${user.loginCode}`);
    await this.userModel.updateOne({ userEmail: user?.userEmail }, { $set: { loginCode: "" } }).exec();
    const userInfo = await  this.userInformationModel.findOne({user: user._id}).populate('user').exec();
    return {
      isNewUser: !userInfo,
      userId: user._id,
    }
  }

  async processReGenerate(){
    try{
      const users = await this.userModel.find();
      if(users.length === 0 ){
        throw new BadRequestException("No users found for this userId");
      }
      users.forEach(user => {
        this.createHabitPlanByUserInfo(user._id.toString());
      })
    }catch (error){
      throw  error;
    }
  }

  async createHabitPlanByUserInfo(userId: string){
    this.logger.debug(`[GetHabitByUserInfo] with userId = [${userId}] called`);
    const userIdObjectId = new Types.ObjectId(userId);
    const userInfo = await  this.userInformationModel.findOne({user: userIdObjectId}).populate('user').exec();
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
        const comparePointsB = countWorkFieldsB + countHobbiesB;
        return comparePointsA - comparePointsB;
      });
    }
    // logic get habits by order of matching with user info
    // each day have 1 -> 2 habit pick from list habit order
    // user need to accept the plan for showing  these habits
    // if user not accept show empty list
    // if user change info => need user confirm a plan again to re-generate a plan
    const {objectIdToHabitMap, habitNameToHabitMap, maxHabits, daysOfWeek} = await  this.getPlanCreationNecessaryData(habitCategories, userId);
    let currentDayIndex = 0;
    let currentDayHabitCount = 0;
    //start to create plan
    const session = await this.habitPlanModel.db.startSession();
    session.startTransaction();
    try {
      const plan = await this.createPlanEntity(userIdObjectId);
      this.logger.debug(`Start to insert habit tracking to days in week with maximum habits ${maxHabits}`)
      for (const [objectId, defaultHabit] of objectIdToHabitMap) {
        if (isDefaultHabits(defaultHabit)) {
          const habitTracking = await this.habitTrackingService.createHabitTracking({
            userId: userId,
            habitId: objectId.toString(),
            progress: defaultHabit.defaultScore
          })
          const habitDaily: HabitDailyPlan = {
            type: HabitType.Default,
            data: habitTracking._id
          }
          const currentDay = daysOfWeek[currentDayIndex];
          const currentPlans = plan.weeklyPlan.get(currentDay) || [];
          this.logger.debug(`Set up for ${currentDay} and default tracking in list ${currentDayHabitCount}`);
          currentPlans.push(habitDaily);
          plan.weeklyPlan.set(currentDay, currentPlans);
          currentDayHabitCount++;
          if (currentDayHabitCount === maxHabits) {
            currentDayIndex = (currentDayIndex + 1) % daysOfWeek.length;
            currentDayHabitCount = 0;
          }
        }
      }
      await plan.save();
      await session.commitTransaction();
      await session.endSession();
      // const planEntity =
      return plan;
    }catch (e){
      this.logger.error(e);
      await session.abortTransaction();
      await session.endSession();
      throw e;
    }
  }

  async processRevokeCode(){
    try{
      await this.userModel.updateMany({ loginCode: { $ne: "" } }, { loginCode: null });
    }catch (e){
      throw e;
    }
  }

  async createPlanEntity(userId: Types.ObjectId){
    this.logger.debug(`[CreatePlanEntity] with userId = [${userId}] called`);
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    this.logger.debug(`Start to create a plan for user from ${startDate} to ${endDate}`);
    const newPlan = {
      userId: userId,
      weeklyPlan: new Map<DaysOfWeek, HabitDailyPlan[]>,
      startDate: startDate,
      endDate,
    }
    return this.habitPlanModel.create(newPlan);
  }

  private async getPlanCreationNecessaryData(habitCategories: HabitCategory[], userId: string){
    const objectIdToHabitMap = new Map<Types.ObjectId, DefaultHabits | Types.ObjectId>();
    const habitNameToHabitMap= new Map<string, DefaultHabits | Types.ObjectId>;
    const numHabits = await this.configsModel.findOne({ configName: maximumHabit});
    const daysOfWeek = Object.values(DaysOfWeek);
    habitCategories.forEach((category)=>{
      category.listDefaultHabits.forEach(defaultHabit=>{
          objectIdToHabitMap.set(defaultHabit._id, defaultHabit);
      })
      category.listDefaultHabits.forEach(defaultHabit=>{
        if (defaultHabit instanceof DefaultHabits) {
          habitNameToHabitMap.set(defaultHabit.name, defaultHabit);
        }
      })
    });
    return {
      objectIdToHabitMap,
      habitNameToHabitMap,
      maxHabits: numHabits?.configValue,
      daysOfWeek
    }
  }

  async getLastPlan(userId: string){
    this.logger.debug(`[GetLastPlan] with userId = [${userId}] called`);
    const userPlan = await this.habitPlanModel.find({
      userId,
    }).sort({_id: -1});
    if(!userPlan){
      throw new BadRequestException('User do not have any habit plan in this week');
    }
    const dailyPlan = userPlan[0].weeklyPlan;
  }

  async getHabitPlanById(habitPlanId: string){
    return this.habitPlanModel.findById(habitPlanId);
  }

  async getHabitPlansByHabitId(habitId: string){
    return this.habitPlanModel.find({habitId});
  }


  async updateUserStreak(userId: Types.ObjectId, currentStreak: number, longestStreak: number) {
    return this.userModel.updateOne({ _id: userId }, { currentStreak, longestStreak });
  }
}