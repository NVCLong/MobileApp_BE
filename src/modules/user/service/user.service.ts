import { BadRequestException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "../schemas/user.schema";
import { Model } from "mongoose";
import { TracingLogger } from "../../tracing-logger/tracing-logger.service";
import { InjectModel } from "@nestjs/mongoose";
import { CreateUserRequestDTO } from "../dtos/createUser.request.dto";
import { EmailValidationHelper } from "../../email-validation/service/email-validation.helper";
import { plainToInstance } from "class-transformer";
import { CreateUserResult } from "../dtos/createUser.resposne.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly logger: TracingLogger,
    private readonly emailValidationHelper: EmailValidationHelper
  ) {
    this.logger.setContext(UserService.name);
  }

  async createUser(request: CreateUserRequestDTO) {
    this.logger.debug("[CreateUser] CreateUser called]");
    const { name, email, age } = request;
    if (!name || !email) {
      this.logger.debug("[CreateUser] Do not have enough information");
      throw new BadRequestException("Missing required fields");
    }
    const result = await this.emailValidationHelper.validateEmail(email);
    if (!result) {
      this.logger.debug("[CreateUser] Email validation failed");
      throw new BadRequestException("Email validation failed");
    }
    this.checkExistEmail(email);
    const res = await this.userModel.create({
      userName: request.name,
      userEmail: request.email,
      age: request.age
    });

    // add notification when user register success
    return plainToInstance(CreateUserResult, {
      userId: res.id,
      status: HttpStatus.CREATED
    });
  }

  private checkExistEmail(email) {
    this.logger.debug("[CheckExistEmail] CheckExistEmail called");
    const user = this.userModel.findOne({ userEmail: email });
    if (!user) {
      this.logger.debug("[CheckExistEmail] User not found and email does not exist");
    }
    throw new BadRequestException("Email validation failed - Email is used by another user");
  }
}