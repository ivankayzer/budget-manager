import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { JwtStrategyMock } from '../jwt.strategy.mock';
import { getRepository } from 'typeorm';
import { Transaction } from '../../src/transactions/transaction.entity';
import transactionFactory from '../factories/transaction';
import { format, addMonths } from 'date-fns';
import { TransactionModule } from '../../src/transactions/transaction.module';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TransactionModule],
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

  it('/ (GET) returns empty array if no transactions found', () => {
    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect([]);
  });

  it('/ (GET) returns transactions', async () => {
    const repo = getRepository(Transaction);
    await Promise.all(transactionFactory.buildList(5).map((t) => repo.save(t)));

    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect(({ body }) => expect(body.length).toBe(5));
  });

  it('/ (GET) returns transactions scoped for this month by default', async () => {
    const repo = getRepository(Transaction);
    await repo.save(
      transactionFactory.build({ paidAt: format(new Date(), 'yyyy-MM-15') }),
    );
    await repo.save(
      transactionFactory.build({
        paidAt: format(addMonths(new Date(), 2), 'yyyy-MM-15'),
      }),
    );

    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect(({ body }) => expect(body.length).toBe(1));
  });

  it('/ (GET) returns transactions for selected month', async () => {
    const repo = getRepository(Transaction);

    const currentDate = format(new Date(), 'yyyy-MM-15');

    await Promise.all(
      transactionFactory
        .buildList(2, {
          paidAt: currentDate,
        })
        .map((t) => repo.save(t)),
    );

    await Promise.all(
      transactionFactory
        .buildList(3, {
          paidAt: format(addMonths(new Date(), 1), 'yyyy-MM-15'),
        })
        .map((t) => repo.save(t)),
    );

    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0].paidAt).toBe(currentDate);
        expect(body[1].paidAt).toBe(currentDate);
      });
  });

  it('/ (GET) returns transactions for selected year', async () => {
    const repo = getRepository(Transaction);

    await Promise.all(
      transactionFactory
        .buildList(2, {
          paidAt: '2018-01-15',
        })
        .map((t) => repo.save(t)),
    );

    await Promise.all(
      transactionFactory
        .buildList(2, {
          paidAt: '2019-01-15',
        })
        .map((t) => repo.save(t)),
    );

    return request(app.getHttpServer())
      .get('/transactions?start=2018&end=2018')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0].paidAt).toBe('2018-01-15');
        expect(body[1].paidAt).toBe('2018-01-15');
      });
  });

  it('/ (GET) returns transactions for selected dates range', async () => {
    const repo = getRepository(Transaction);

    await Promise.all(
      transactionFactory
        .buildList(2, {
          paidAt: '2018-01-15',
        })
        .map((t) => repo.save(t)),
    );

    await Promise.all(
      transactionFactory
        .buildList(3, {
          paidAt: '2018-01-16',
        })
        .map((t) => repo.save(t)),
    );

    await Promise.all(
      transactionFactory
        .buildList(2, {
          paidAt: '2018-01-17',
        })
        .map((t) => repo.save(t)),
    );

    return request(app.getHttpServer())
      .get('/transactions?start=2018-01-15&end=2018-01-16')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBe(5);
        expect(body[0].paidAt).toBe('2018-01-16');
        expect(body[1].paidAt).toBe('2018-01-16');
        expect(body[2].paidAt).toBe('2018-01-16');
        expect(body[3].paidAt).toBe('2018-01-15');
      });
  });

  it('/ (GET) returns transactions ordered descending by `paidAt`', async () => {
    const repo = getRepository(Transaction);

    await Promise.all(
      transactionFactory
        .buildList(1, {
          paidAt: '2018-01-14',
        })
        .map((t) => repo.save(t)),
    );

    await Promise.all(
      transactionFactory
        .buildList(1, {
          paidAt: '2018-01-15',
        })
        .map((t) => repo.save(t)),
    );

    return request(app.getHttpServer())
      .get('/transactions?start=2018&end=2018')
      .expect(200)
      .expect(({ body }) => {
        expect(body.length).toBe(2);
        expect(body[0].paidAt).toBe('2018-01-15');
        expect(body[1].paidAt).toBe('2018-01-14');
      });
  });

  it('/ (POST) creates a transaction and returns created transaction', async () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 500,
        type: 'income',
        paidAt: '2020-01-01',
        description: 'Fake description',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.amount).toBe(500);
        expect(body.type).toBe('income');
        expect(body.paidAt).toBe('2020-01-01');
        expect(body.description).toBe('Fake description');
      });
  });

  it('/ (POST) will fail validation if you dont provide `amount`', async () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        paidAt: '2020-01-01',
        type: 'expense',
        description: 'Fake description',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('amount');
      });
  });

  it('/ (POST) will fail validation if you provide wrong `amount`', async () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        paidAt: '2020-01-01',
        type: 'expense',
        description: 'Fake description',
        amount: 'Wrong amount',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('amount');
      });
  });

  it('/ (POST) will fail validation if you dont provide `type`', async () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 500,
        paidAt: '2020-01-01',
        description: 'Fake description',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('type');
      });
  });

  it('/ (POST) will fail validation if you provide wrong `type`', async () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 500,
        paidAt: '2020-01-01',
        description: 'Fake description',
        type: 'Wrong type',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('type');
      });
  });

  it('/ (POST) will fail validation if you dont provide `paidAt`', async () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 500,
        type: 'expense',
        description: 'Fake description',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('paidAt');
      });
  });

  it('/ (POST) will fail validation if you provide `paidAt` in wrong format', async () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 500,
        type: 'expense',
        description: 'Fake description',
        paidAt: '1-1-1-1-1',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('paidAt');
      });
  });

  it('/ (POST) will succeed without description', async () => {
    return request(app.getHttpServer())
      .post('/transactions')
      .send({
        amount: 500,
        type: 'income',
        paidAt: '2020-01-01',
      })
      .expect(201);
  });

  it('/:id (PATCH) updates a transaction and returns updated transaction', async () => {
    await request(app.getHttpServer()).post('/transactions').send({
      amount: 500,
      type: 'income',
      paidAt: '2020-01-01',
      description: 'Fake description',
    });

    request(app.getHttpServer())
      .patch(`/transactions/1`)
      .send({
        amount: 501,
        type: 'expense',
        paidAt: '2020-01-02',
        description: 'Changed description',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.amount).toBe(501);
        expect(body.type).toBe('expense');
        expect(body.paidAt).toBe('2020-01-02');
        expect(body.description).toBe('Changed description');
      });
  });

  it('/:id (DELETE) will delete a transaction', async () => {
    const repo = getRepository(Transaction);

    await request(app.getHttpServer())
      .post('/transactions')
      .send(transactionFactory.build());

    expect((await repo.find({})).length).toEqual(1);

    await request(app.getHttpServer()).delete('/transactions/1');

    expect((await repo.find({})).length).toEqual(0);
  });
});
