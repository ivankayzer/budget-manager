import { Factory } from 'fishery';
import { lorem, datatype, random } from 'faker';
import { Budget as BudgetEntity } from '../../src/budgets/budget.entity';
import { BudgetScheduler as BudgetSchedulerEntity } from '../../src/budgets/budget-scheduler.entity';
import { DateCreator } from '../../src/date-creator';
import { RepeatFrequency } from '../../src/budgets/interfaces/repeat-frequency';

export const Budget = Factory.define<BudgetEntity>(() => {
  const [start, end] = new DateCreator().createBetween(
    '2018-01-01',
    '2018-01-30',
  );

  return {
    id: null,
    userId: 'fake-user',
    start,
    end,
    amount: datatype.number(100000),
    createdAt: undefined,
    categories: [],
    scheduler: null,
  };
});

export const BudgetScheduler = Factory.define<BudgetSchedulerEntity>(() => ({
  id: null,
  userId: 'fake-user',
  start: '2018-01-05',
  amount: datatype.number(100000),
  rollover: random.arrayElement([false, true]),
  repeat: random.arrayElement([
    RepeatFrequency.monthly,
    RepeatFrequency.weekly,
    RepeatFrequency.none,
  ]),
  createdAt: undefined,
  categories: [],
}));
