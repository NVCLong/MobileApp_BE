import { DefaultHabits } from "../modules/default_habits/schema/default_habits.schema";

export const toBoolean = ( value: any ) => {
  if (typeof value === 'string') {
    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true') return true;
    if (lowerValue === 'false') return false;
    if (!isNaN(Number(value))) return Number(value) === 1;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return false;
}
