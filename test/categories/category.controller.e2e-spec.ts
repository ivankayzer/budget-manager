import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { JwtStrategyMock } from '../jwt.strategy.mock';
import { getRepository } from 'typeorm';
import { Category } from '../../src/categories/category.entity';
import categoryFactory from '../factories/category';
import { format, addMonths } from 'date-fns';

describe('CategoryController (e2e)', () => {
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

  it('/ (GET) returns empty array if no categories found', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect([]);
  });

  it('/ (GET) returns categories', async () => {
    const repo = getRepository(Category);
    await Promise.all(categoryFactory.buildList(5).map((t) => repo.save(t)));

    return request(app.getHttpServer())
      .get('/categories')
      .expect(200)
      .expect(({ body }) => expect(body.length).toBe(5));
  });

  it('/ (POST) creates a category and returns created category', async () => {
    return request(app.getHttpServer())
      .post('/categories')
      .send({
        name: 'Fake name',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body.name).toBe('Fake name');
      });
  });

  it('/ (POST) will fail validation if you dont provide `name`', async () => {
    return request(app.getHttpServer())
      .post('/categories')
      .send({})
      .expect(400)
      .expect(({ body }) => {
        expect(body.message[0].field).toBe('name');
      });
  });

  it('/:id (PATCH) updates a category and returns updated category', async () => {
    await request(app.getHttpServer()).post('/categories').send({
      name: 'Fake name',
    });

    request(app.getHttpServer())
      .patch(`/categories/1`)
      .send({
        name: 'Changed name',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.name).toBe('Changed name');
      });
  });

  it('/:id (DELETE) will delete a category', async () => {
    const repo = getRepository(Category);

    await request(app.getHttpServer())
      .post('/categories')
      .send(categoryFactory.build());

    expect((await repo.find({})).length).toEqual(1);

    await request(app.getHttpServer()).delete('/categories/1');

    expect((await repo.find({})).length).toEqual(0);
  });
});
