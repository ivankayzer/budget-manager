import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { JwtStrategyMock } from '../jwt.strategy.mock';
import { Budget } from '../../src/budgets/budget.entity';
import { getRepository } from 'typeorm';
import { addMonths, format } from 'date-fns';
import { Budget as budgetFactory } from '../factories/budget';
import { RepeatFrequency } from '../../src/budgets/interfaces/repeat-frequency';
import { BudgetScope } from '../../src/budgets/interfaces/budget-scope';
import { Category } from '../../src/categories/category.entity';
import { BudgetScheduler } from '../../src/budgets/budget-scheduler.entity';

describe('BudgetController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtStrategy)
      .useClass(JwtStrategyMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET) returns empty array if no budgets found', () => {
    return request(app.getHttpServer()).get('/budgets').expect(200).expect([]);
  });

  it('/ (GET) returns budgets for this month by default', async () => {
    const repo = getRepository(Budget);
    await repo.save(
      budgetFactory.build({
        start: format(new Date(), 'yyyy-MM-15'),
        end: format(new Date(), 'yyyy-MM-28'),
      }),
    );
    await repo.save(
      budgetFactory.build({
        start: format(addMonths(new Date(), 2), 'yyyy-MM-15'),
        end: format(addMonths(new Date(), 2), 'yyyy-MM-28'),
      }),
    );

    return request(app.getHttpServer())
      .get('/budgets')
      .expect(200)
      .expect(({ body }) => expect(body.length).toBe(1));
  });

  it('/ (GET) returns budgets for date range', async () => {
    const repo = getRepository(Budget);
    await repo.save(
      budgetFactory.build({
        start: '2018-01-01',
        end: '2018-01-05',
      }),
    );
    await repo.save(
      budgetFactory.build({
        start: '2018-01-03',
        end: '2018-01-10',
      }),
    );
    await repo.save(
      budgetFactory.build({
        start: '2017-12-31',
        end: '2018-01-04',
      }),
    );
    await repo.save(
      budgetFactory.build({
        start: '2018-01-06',
        end: '2018-01-16',
      }),
    );

    return request(app.getHttpServer())
      .get('/budgets?start=2018-01-01&end=2018-01-05')
      .expect(200)
      .expect(({ body }) => expect(body.length).toBe(3));
  });

  it('/ (POST) `end` date should be greater than `start`', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        end: '2018-01-01',
        amount: 1000,
        categoryIds: [],
        rollover: false,
        repeat: RepeatFrequency.none,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('end');
      });
  });

  it('/ (POST) `end` date cant be used with `rollover`', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        end: '2018-01-03',
        amount: 1000,
        categoryIds: [],
        rollover: true,
        repeat: RepeatFrequency.none,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('end');
      });
  });

  it('/ (POST) `end` date cant be used with `repeat` field', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        end: '2018-01-03',
        amount: 1000,
        categoryIds: [],
        rollover: false,
        repeat: RepeatFrequency.monthly,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('end');
      });
  });

  it('/ (POST) `end` should be a date string if provided', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        end: 'wrong date',
        amount: 1000,
        categoryIds: [],
        rollover: false,
        repeat: RepeatFrequency.none,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('end');
      });
  });

  it('/ (POST) `repeat` cant be `none` if no end date provided', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        amount: 1000,
        categoryIds: [],
        rollover: false,
        repeat: RepeatFrequency.none,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('repeat');
      });
  });

  it('/ (POST) `start` should be a date string', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: 'wrong date',
        amount: 1000,
        categoryIds: [],
        rollover: true,
        repeat: RepeatFrequency.none,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('start');
      });
  });

  it('/ (POST) `amount` is required', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        categoryIds: [],
        rollover: false,
        repeat: RepeatFrequency.monthly,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('amount');
      });
  });

  it('/ (POST) `amount` should be greater than zero', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        categoryIds: [],
        rollover: false,
        amount: -100,
        repeat: RepeatFrequency.monthly,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('amount');
      });
  });

  it('/ (POST) `categoryIds` is required', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.monthly,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('categoryIds');
      });
  });

  it('/ (POST) `rollover` is required', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        amount: 1000,
        categoryIds: [],
        repeat: RepeatFrequency.monthly,
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('rollover');
      });
  });

  it('/ (POST) `repeat` is required', async () => {
    return request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-02',
        rollover: false,
        amount: 1000,
        categoryIds: [],
      })
      .expect(422)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('repeat');
      });
  });

  it('/ (POST) creates a budget with an end date', async () => {
    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        end: '2018-01-31',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.none,
        categoryIds: [],
      })
      .expect(201);

    const repo = getRepository(Budget);
    const budget = await repo.findOne({
      where: {
        amount: 1000,
        start: '2018-01-01',
        end: '2018-01-31',
      },
    });

    expect(budget.id).toBe(1);
  });

  it('/:id (PATCH) updates a budget with type `this`', async () => {
    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        end: '2018-01-31',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.none,
        categoryIds: [],
      })
      .expect(201);

    await request(app.getHttpServer())
      .patch('/budgets/1')
      .send({
        amount: 1010,
        change: BudgetScope.this,
      })
      .expect(200);

    const repo = getRepository(Budget);
    const budget = await repo.findOne(1);

    expect(budget.amount).toBe(1010);
  });

  it('/:id (PATCH) will throw 404 if trying to update non existing record', async () => {
    await request(app.getHttpServer())
      .patch('/budgets/5')
      .send({
        amount: 1010,
        change: BudgetScope.this,
      })
      .expect(404);
  });

  it('/:id (DELETE) deletes a budget with type `this`', async () => {
    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        end: '2018-01-31',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.none,
        categoryIds: [],
      })
      .expect(201);

    await request(app.getHttpServer())
      .delete('/budgets/1')
      .send({
        delete: BudgetScope.this,
      })
      .expect(200);

    const repo = getRepository(Budget);
    const budget = await repo.findOne(1);

    expect(budget).toBe(undefined);
  });

  it('/:id (DELETE) will throw 404 if trying to delete non existing record', async () => {
    await request(app.getHttpServer())
      .delete('/budgets/5')
      .send({
        delete: BudgetScope.this,
      })
      .expect(404);
  });

  it('/ (POST) creates a scheduled budget and a normal budget', async () => {
    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.monthly,
        categoryIds: [],
      })
      .expect(201);

    const budgetsRepo = getRepository(Budget);
    const budget = await budgetsRepo.findOne(1);

    expect(budget.amount).toBe(1000);
    expect(budget.start).toBe('2018-01-01');
    expect(budget.end).toBe('2018-01-31');
    expect(budget.scheduler.amount).toBe(1000);
    expect(budget.scheduler.repeat).toBe(RepeatFrequency.monthly);
  });

  it('/:id (PATCH) updates amount in a budget with type `this-and-upcoming`', async () => {
    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.monthly,
        categoryIds: [],
      })
      .expect(201);

    const repo = getRepository(Budget);
    const budget = await repo.findOne(1);
    const secondBudget = new Budget();
    secondBudget.start = budget.start;
    secondBudget.end = budget.end;
    secondBudget.amount = budget.amount;
    secondBudget.scheduler = budget.scheduler;
    secondBudget.userId = budget.userId;
    await repo.save(secondBudget);

    await request(app.getHttpServer())
      .patch('/budgets/1')
      .send({
        amount: 1010,
        change: BudgetScope.thisAndUpcoming,
      })
      .expect(200);

    const budget1 = await repo.findOne(1);
    const budget2 = await repo.findOne(2);
    expect(budget1.amount).toBe(1010);
    expect(budget2.amount).toBe(1010);
    expect(budget1.scheduler.amount).toBe(1010);
  });

  it('/:id (PATCH) updates amount in a budget scheduler with type `upcoming`', async () => {
    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.monthly,
        categoryIds: [],
      })
      .expect(201);

    const repo = getRepository(Budget);
    const budget = await repo.findOne(1);
    const secondBudget = new Budget();
    secondBudget.start = budget.start;
    secondBudget.end = budget.end;
    secondBudget.amount = budget.amount;
    secondBudget.scheduler = budget.scheduler;
    secondBudget.userId = budget.userId;
    await repo.save(secondBudget);

    await request(app.getHttpServer())
      .patch('/budgets/1')
      .send({
        amount: 1010,
        change: BudgetScope.upcoming,
      })
      .expect(200);

    const budget1 = await repo.findOne(1);
    const budget2 = await repo.findOne(2);
    expect(budget1.amount).toBe(1000);
    expect(budget2.amount).toBe(1010);
    expect(budget1.scheduler.amount).toBe(1010);
  });

  it('/ (POST) creates a scheduled budget and a normal budget with categories', async () => {
    const categoryRepository = getRepository(Category);
    const category1 = new Category();
    category1.userId = 'fake-user';
    category1.name = 'fake-1';

    const category2 = new Category();
    category2.userId = 'fake-user';
    category2.name = 'fake-2';

    await categoryRepository.save(category1);
    await categoryRepository.save(category2);

    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        end: '2018-01-31',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.none,
        categoryIds: [category1.id, category2.id],
      })
      .expect(201);

    const repo = getRepository(Budget);
    const budget = await repo.findOne(1);

    expect(budget.categories.map((category) => category.id)).toStrictEqual([
      1, 2,
    ]);
  });

  it('/ (POST) creates a budget with categories', async () => {
    const categoryRepository = getRepository(Category);
    const category1 = new Category();
    category1.userId = 'fake-user';
    category1.name = 'fake-1';

    const category2 = new Category();
    category2.userId = 'fake-user';
    category2.name = 'fake-2';

    await categoryRepository.save(category1);
    await categoryRepository.save(category2);

    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.monthly,
        categoryIds: [category1.id, category2.id],
      })
      .expect(201);

    const repo = getRepository(Budget);
    const budget = await repo.findOne(1);

    expect(budget.categories.map((category) => category.id)).toStrictEqual([
      1, 2,
    ]);

    expect(
      budget.scheduler.categories.map((category) => category.id),
    ).toStrictEqual([1, 2]);
  });

  it('/:id (DELETE) deletes a budget scheduler with type `upcoming`', async () => {
    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.monthly,
        categoryIds: [],
      })
      .expect(201);

    const repo = getRepository(Budget);
    const budget = await repo.findOne(1);
    const secondBudget = new Budget();
    secondBudget.start = budget.start;
    secondBudget.end = budget.end;
    secondBudget.amount = budget.amount;
    secondBudget.scheduler = budget.scheduler;
    secondBudget.userId = budget.userId;
    await repo.save(secondBudget);

    await request(app.getHttpServer())
      .delete('/budgets/1')
      .send({
        delete: BudgetScope.upcoming,
      })
      .expect(200);

    const budget1 = await repo.findOne(1);
    const budget2 = await repo.findOne(2);

    expect(budget1.scheduler).toBe(null);
    expect(budget2).toBe(undefined);
  });

  it('/:id (DELETE) deletes a budget with type `this-and-upcoming`', async () => {
    await request(app.getHttpServer())
      .post('/budgets')
      .send({
        start: '2018-01-01',
        rollover: false,
        amount: 1000,
        repeat: RepeatFrequency.monthly,
        categoryIds: [],
      })
      .expect(201);

    const repo = getRepository(Budget);
    const budget = await repo.findOne(1);
    const secondBudget = new Budget();
    secondBudget.start = budget.start;
    secondBudget.end = budget.end;
    secondBudget.amount = budget.amount;
    secondBudget.scheduler = budget.scheduler;
    secondBudget.userId = budget.userId;
    await repo.save(secondBudget);

    await request(app.getHttpServer())
      .delete('/budgets/1')
      .send({
        delete: BudgetScope.thisAndUpcoming,
      })
      .expect(200);

    const budget1 = await repo.findOne(1);
    const budget2 = await repo.findOne(2);

    expect(budget1).toBe(undefined);
    expect(budget2).toBe(undefined);
  });
});
