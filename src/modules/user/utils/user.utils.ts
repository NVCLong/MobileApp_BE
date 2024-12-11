import { DefaultHabits } from "../../default_habits/schema/default_habits.schema";

export function isDefaultHabits(habit: any): habit is DefaultHabits {
  return habit && habit.defaultScore !== undefined;
}