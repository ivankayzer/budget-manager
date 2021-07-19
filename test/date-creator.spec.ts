import { DateCreator } from '../src/date-creator';
import { format as fnsFormat, startOfMonth, endOfMonth } from 'date-fns';

describe('DateCreator', () => {
  const format = (date: Date) => fnsFormat(date, 'yyyy-MM-dd');

  it('creates dates for current month by default', () => {
    const [start, end] = new DateCreator().create();

    expect(start).toBe(format(startOfMonth(new Date())));
    expect(end).toBe(format(endOfMonth(new Date())));
  });

  it('creates dates for year', () => {
    const [start, end] = new DateCreator().create('2018');

    expect(start).toBe('2018-01-01');
    expect(end).toBe('2018-12-31');
  });

  it('creates dates for month in a year', () => {
    const [start, end] = new DateCreator().create('2018-03');

    expect(start).toBe('2018-03-01');
    expect(end).toBe('2018-03-31');
  });

  it('creates dates for range of years', () => {
    const [start, end] = new DateCreator().createBetween('2018', '2020');

    expect(start).toBe('2018-01-01');
    expect(end).toBe('2020-12-31');
  });

  it('creates dates for range of months in a year', () => {
    const [start, end] = new DateCreator().createBetween('2018-01', '2020-04');

    expect(start).toBe('2018-01-01');
    expect(end).toBe('2020-04-30');
  });

  it('returns current date twice if full date provided', () => {
    const [start, end] = new DateCreator().create('2018-03-01');

    expect(start).toBe('2018-03-01');
    expect(end).toBe('2018-03-01');
  });

  it('throws an error for wrong format', () => {
    expect(() => {
      new DateCreator().create('Not a date');
    }).toThrowError();
  });
});
