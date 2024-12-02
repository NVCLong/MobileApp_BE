import { Hobby, Sport, UserSupportWorkField } from "../utils/user.constant";
import { Expose } from "class-transformer";

export class GetUserInfoResponse {
  @Expose()
  userId: string;
  @Expose()
  userName: string;
  @Expose()
  userEmail: string;
  @Expose()
  userWorkFields : UserSupportWorkField[];
  @Expose()
  userHobbies: Hobby[];
  @Expose()
  userFavSport: Sport[];
  @Expose()
  userUsingPhoneTime: number;
  @Expose()
  userExerciseTime: number;
}