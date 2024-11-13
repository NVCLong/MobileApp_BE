import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "../service/user.service";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { CreateUserRequestDTO } from "../dtos/createUser.request.dto";

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

}