import {Module} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UsersController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { UserInformation, UserInformationSchema } from "./schemas/user-information.schema";
import { HabitCategories, HabitCategory } from "../default_habits/schema/habit-categories.schema";
import { HabitPlan, HabitPlanSchema } from "./schemas/user-habit-plan.schema";
import { UserHabitTracking, UserHabitTrackingSchema } from "../default_habits_value/schema/user-tracking-info.schema";


@Module({
    imports: [MongooseModule.forFeature([
        {name: User.name, schema: UserSchema},
        { name: UserInformation.name, schema: UserInformationSchema},
        {name : HabitCategory.name, schema: HabitCategories},
        { name: HabitPlan.name, schema: HabitPlanSchema},
        { name: UserHabitTracking.name, schema: UserHabitTrackingSchema}])],
    providers: [UserService],
    controllers: [UsersController],
    exports: [UserService, MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
})
export class UserModule {}