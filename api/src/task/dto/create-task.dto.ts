export class CreateTaskDto {
  icon: number;

  color: number;

  timesPerDay: number;

  hasDuration: boolean;

  duration: number;

  title: string;

  schedule: number[];

  repeatable: boolean;

  currentStreak: number;

  longestStreak: number;

  startDate: Date;

  endDate: Date;
  // history: Tracker;
}
