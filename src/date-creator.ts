import {
  format as fnsFormat,
  endOfMonth,
  startOfMonth,
  startOfYear,
  endOfYear,
} from 'date-fns';

export class DateCreator {
  public create(date?: string): [string, string] {
    if (!date) {
      return this.currentMonth();
    }

    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return [date, date];
    }

    if (date.match(/^\d{4}$/)) {
      return this.forYear(date);
    }

    if (date.match(/^\d{4}-\d{2}$/)) {
      return this.forMonthInYear(date);
    }

    throw new Error('Wrong date');
  }

  public createBetween(start: string, end: string): [string, string] {
    const [startDate] = this.create(start);
    const [, endDate] = this.create(end);

    return [startDate, endDate];
  }

  private forYear(year: string): [string, string] {
    return [
      this.format(startOfYear(new Date(year))),
      this.format(endOfYear(new Date(year))),
    ];
  }

  private forMonthInYear(yearWithMonth: string): [string, string] {
    const [year, month] = yearWithMonth.split('-');

    return [
      this.format(startOfMonth(new Date(+year, +month - 1))),
      this.format(endOfMonth(new Date(+year, +month - 1))),
    ];
  }

  private currentMonth(): [string, string] {
    return [
      this.format(startOfMonth(new Date())),
      this.format(endOfMonth(new Date())),
    ];
  }

  private format(date: Date): string {
    return fnsFormat(date, 'yyyy-MM-dd');
  }
}
