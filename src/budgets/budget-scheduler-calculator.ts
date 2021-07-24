import { Injectable } from '@nestjs/common';
import { addMonths, addWeeks, parse } from 'date-fns';
import { DateCreator } from '../date-creator';
import { RepeatFrequency } from './interfaces/repeat-frequency';

@Injectable()
export class BudgetSchedulerCalculator {
  constructor(private dateCreator: DateCreator) {}

  public calculateEndFromStart(
    repeat: RepeatFrequency,
    start: string,
  ): string | null {
    if (repeat === RepeatFrequency.none) {
      return null;
    }

    let date = parse(start, this.dateCreator.getFormat(), new Date());

    if (repeat === RepeatFrequency.monthly) {
      date = addMonths(date, 1);
    }

    if (repeat === RepeatFrequency.weekly) {
      date = addWeeks(date, 1);
    }

    return this.dateCreator.format(date);
  }
}
