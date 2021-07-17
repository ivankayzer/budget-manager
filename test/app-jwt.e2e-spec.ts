import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { JwtStrategyMock } from './jwt.strategy.mock';

describe('AppController (e2e)', () => {
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

  it('/protected (GET+JWT)', () => {
    return request(app.getHttpServer())
      .get('/protected')
      .expect(200)
      .expect({ message: 'Hello, you are authenticated.' });
  });

  afterEach(async () => {
    await app.close();
  });
});
