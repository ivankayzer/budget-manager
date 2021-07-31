import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BudgetCron } from '../../src/budgets/budget.cron';
import { AppModule } from '../../src/app.module';
import { Budget } from '../../src/budgets/budget.entity';
import { getRepository } from 'typeorm';
import { BudgetScheduler } from '../../src/budgets/budget-scheduler.entity';
import { RepeatFrequency } from '../../src/budgets/interfaces/repeat-frequency';
import { DateCreator } from '../../src/date-creator';
import { endOfMonth, startOfMonth } from 'date-fns';

describe('BudgetCron (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('creates scheduled budgets', async () => {
    const cron = await app.resolve(BudgetCron);

    const schedulerRepo = getRepository(BudgetScheduler);
    const scheduler = new BudgetScheduler();

    scheduler.userId = 'fake-user';
    scheduler.amount = 1000;
    scheduler.repeat = RepeatFrequency.monthly;
    scheduler.start = '2017-06-01';

    await schedulerRepo.save(scheduler);

    const repo = getRepository(Budget);
    const budget = new Budget();

    budget.start = '2017-06-01';
    budget.end = '2017-06-30';
    budget.amount = scheduler.amount;
    budget.scheduler = scheduler;
    budget.userId = scheduler.userId;

    await repo.save(budget);

    await cron.generateScheduledBudgets();

    const budget1 = await repo.findOne({
      start: '2019-01-01',
      end: '2019-01-31',
    });

    const budget2 = await repo.findOne({
      start: new DateCreator().format(startOfMonth(new Date())),
      end: new DateCreator().format(endOfMonth(new Date())),
    });

    expect(budget1.id).toBeGreaterThan(0);
    expect(budget2.id).toBeGreaterThan(0);
  });
});
