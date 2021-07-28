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
});
