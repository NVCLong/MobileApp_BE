import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { CreateUserRequestDTO } from "../dtos/createUser.request.dto";
import { UserInfoRequest } from "../dtos/user-information.request.dto";
import { CheckCodeRequestDto } from "../dtos/check-code-request.dto";


@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: TracingLogger,
  ) {
    this.logger.setContext(UsersController.name)
  }

  @Post('')
  async createUser(@Body() request: CreateUserRequestDTO): Promise<any> {
    try{
      this.logger.log("Receive create user request");
      return await this.userService.loginUser(request);
    }catch(error){
      this.logger.error("Error creating user");
      throw error;
    }
  }

  // @Post('updateStreak')
  // async updateStreak(@Body() request: UpdateStreakDTO): Promise<any> {
  //   const user = await this.userService.getUserById(request.userId);
  //
  //   try{
  //     this.logger.log("Receive update streak request");
  //
  //     if(request.purpose === "reset"){
  //       return await this.userService.resetStreak(user, request.streak);
  //     }else if(request.purpose === "update"){
  //       return await this.userService.updateStreaks(user, request.streak);
  //     }
  //   }catch(error){
  //     this.logger.error("Error updating streak");
  //     throw error;
  //   }
  // }

  @Post('/entryForm/:id')
  async submitEntryForm(@Body() request: UserInfoRequest, @Param('id') userId: string): Promise<any> {
    try{
      this.logger.log("Receive submit user request");
      const {userHobbies, userWorkFields, timeUsingPhone}= request;
      if(!userHobbies || !userWorkFields || timeUsingPhone < 0 || !userId){
        throw new  BadRequestException("Missing one in these fields hobbies, work fields, time using phones");
      }
      return this.userService.updateUserInformation(request, userId);
    }catch (err){
      this.logger.error("Error creating user");
      throw err;
    }
  }

  @Get('/getUserInfo/:id')
  async getUserInfo(@Param("id") userId: string): Promise<any> {
    try{
      this.logger.log("Receive getting user info");
      return await this.userService.getUserInformation(userId);
    }catch(e){
      this.logger.error("Error getting user info");
      throw e
    }
  }

  @Post('/checkAccessCode')
  async checkAccessCode(@Body() request: CheckCodeRequestDto): Promise<any> {
    try{
      this.logger.log("Receive check access code");
      return await this.userService.checkAccessCode(request.userId, request.code);
    }catch (e){
      throw e
    }
  }

  @Get('/createHabitPlan/:id')
  async createHabitPlan(@Param('id') id: string): Promise<any> {
    try{
      this.logger.log("Receive getting default habit");
      return await this.userService.createHabitPlanByUserInfo(id);
    }catch (e){
      this.logger.error("Error getting default habit");
      throw e;
    }
  }
}