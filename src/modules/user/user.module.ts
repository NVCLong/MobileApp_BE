import {Module} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersController } from "./controller/user.controller";
import { UserService } from "./service/user.service";

@Module({
    imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    providers: [UserService],
    controllers: [UsersController],
    exports: [UserService],
})
export class UserModule {}