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

  // rollover + repeat + end date should not be possible

  it('/ (POST) end date should be greater than start', async () => {
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

  it('/ (POST) end date cant be used with rollover', async () => {
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

  it('/ (POST) end date cant be used with repeat field', async () => {
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
});
