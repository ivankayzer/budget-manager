import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { JwtStrategyMock } from '../jwt.strategy.mock';
import { MigrationRunner } from '../migration-runner';
import { getRepository, Repository } from 'typeorm';
import { Transaction } from '../../src/transactions/transaction.entity';
import transactionFactory from '../factories/transaction';
import { format, addMonths } from 'date-fns';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let migrationRunner: MigrationRunner;
  let repo: Repository<Transaction>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtStrategy)
      .useClass(JwtStrategyMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    migrationRunner = new MigrationRunner();
    await migrationRunner.migrate();

    repo = getRepository(Transaction);
  });

  it('/ (GET) returns empty array if no transactions found', () => {
    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect([]);
  });

  it('/ (GET) returns transactions', async () => {
    await Promise.all(transactionFactory.buildList(5).map((t) => repo.save(t)));

    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect(({ body }) => expect(body.length).toBe(5));
  });

  it('/ (GET) returns transactions scoped for this month', async () => {
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

  it('/ (POST) will fail validation if you provide wrong `type`', async () => {
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
    request(app.getHttpServer()).post('/transactions').send({
      amount: 500,
      type: 'income',
      paidAt: '2020-01-01',
      description: 'Fake description',
    });

    return request(app.getHttpServer())
      .patch('/transactions/1')
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

  it('/:id (DELETE) will delete a transaction', async () => {});

  afterEach(async () => {
    await migrationRunner.undo();
    await app.close();
  });
});