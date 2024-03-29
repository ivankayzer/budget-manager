import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect({ message: 'Hello from Finansist!' });
  });

  it('/protected (GET)', () => {
    return request(app.getHttpServer())
      .get('/protected')
      .expect(401)
      .expect({ statusCode: 401, message: 'Unauthorized' });
  });

  afterEach(async () => {
    await app.close();
  });
});
