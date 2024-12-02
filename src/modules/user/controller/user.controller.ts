import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { CreateUserRequestDTO } from "../dtos/createUser.request.dto";
import { UserInfoRequest } from "../dtos/user-information.request.dto";


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
      return await this.userService.createUser(request);
    }catch(error){
      this.logger.error("Error creating user");
      throw error;
    }
  }

  @Post('/entryForm/:id')
  async submitEntryForm(@Body() request: UserInfoRequest, @Param('id') userId: number): Promise<any> {
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

  @Get('/:id')
  async getUserInfo(@Param('id') id: string): Promise<any> {
    try{
      this.logger.log("Receive getting user info");
      return await this.userService.getUserInformation(id);
    }catch(e){
      this.logger.error("Error getting user info");
      throw new BadRequestException(e);
    }
  }

  @Get('/createHabitPlan/:id')
  async getDefaultHabit(@Param('id') id: string): Promise<any> {
    try{
      this.logger.log("Receive getting default habit");
      return await this.userService.createHabitPlanByUserInfo(id);
    }catch (e){
      this.logger.error("Error getting default habit");
      throw e;
    }
  }
}