import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { JwtStrategyMock } from './jwt.strategy.mock';
import { TransactionModule } from '../src/transactions/transaction.module';
import { MigrationRunner } from './migration-runner';
import { getRepository } from 'typeorm';
import { Transaction } from '../src/transactions/transaction.entity';
import transactionFactory from './factories/transaction';
import { Response } from 'express';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let migrationRunner: MigrationRunner;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TransactionModule],
    })
      .overrideProvider(JwtStrategy)
      .useClass(JwtStrategyMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    migrationRunner = new MigrationRunner();
    await migrationRunner.migrate();
  });

  it('/ (GET) returns empty array if no transactions found', () => {
    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect([]);
  });

  it('/ (GET) returns transactions', async () => {
    const repo = getRepository(Transaction);

    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .expect([]);
  });

  afterEach(async () => {
    await migrationRunner.undo();
    await app.close();
  });
});
