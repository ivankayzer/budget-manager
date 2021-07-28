import { RepeatFrequency } from './repeat-frequency';

export interface ScheduledBudgetRow {
  budgetId: number;
  schedulerId: number;
  maxEnd: Date;
  repeat: RepeatFrequency;
}
