export class SyncHabitDTO {
  userId: string;
  habits: {habitId: string, completions: number[]}[];
}