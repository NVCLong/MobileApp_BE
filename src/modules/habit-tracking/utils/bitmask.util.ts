export class BitmaskUtil{

  /**
   * Marks a day as completed by setting the bit position, the logic will push down day check.
   * @param bitmask Current bitmask.
   * @param dayOffset Days offset from today (0 = today, 1 = yesterday, etc.).
   * @returns Updated bitmask by `|`.
   */
  static markDayCompleted(bitmask: number, day: number): number {
    if(day < 0 || day > 63){
      throw new Error('Day offset must be between 0 and 63');
    }
    return bitmask | (1 << day);
  }


  static isDayCompleted(bitmask: number, day: number): boolean {
    if(day < 0 || day > 63){
      throw new Error('Day offset must be between 0 and 63');
    }
    return (bitmask & (1 << day)) !== 0;
  }

  static shiftBitmask(bitmask: number): number {
    return bitmask >> 1;
  }

  static initializeBitmask(): number {
    return 1; // only least significant bit is set today
  }
}