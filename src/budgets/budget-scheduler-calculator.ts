import { Injectable } from '@nestjs/common';
import { addMonths, addWeeks, parse } from 'date-fns';
import { DateCreator } from 'src/date-creator';

@Injectable()
export class BudgetSchedulerCalculator {
  constructor(private dateCreator: DateCreator) {}

  public calculateEndFromStart(
    repeat: RepeatFrequency,
    start: string,
  ): string | null {
    if (repeat === 'none') {
      return null;
    }

    let date = parse(start, this.dateCreator.getFormat(), new Date());

    if (repeat === 'monthly') {
      date = addMonths(date, 1);
    }

    if (repeat === 'weekly') {
      date = addWeeks(date, 1);
    }

    return this.dateCreator.format(date);
  }
}
