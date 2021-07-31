import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../../src/categories/category.entity';
import { Transaction } from '../../src/transactions/transaction.entity';
import { getRepository } from 'typeorm';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { JwtStrategyMock } from '../jwt.strategy.mock';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

describe('AnalyticsController (e2e)', () => {
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

  it('calculates analytics correctly', async () => {
    const transactionRepo = getRepository(Transaction);
    const categoriesRepo = getRepository(Category);

    const notOwnedCategory = new Category();
    notOwnedCategory.userId = 'fake-user-1';
    notOwnedCategory.name = 'fake-category-1';

    const category1 = new Category();
    category1.userId = 'fake-user';
    category1.name = 'fake-category-2';

    const category2 = new Category();
    category2.userId = 'fake-user';
    category2.name = 'fake-category-3';

    await categoriesRepo.save(notOwnedCategory);
    await categoriesRepo.save(category1);
    await categoriesRepo.save(category2);

    const fakeExpense = [
      {
        category: notOwnedCategory,
        amount: 500,
        type: 'expense',
      },
      {
        category: notOwnedCategory,
        amount: 4500,
        type: 'expense',
      },
    ];
    const fakeIncome = [
      {
        category: notOwnedCategory,
        amount: 5000,
        type: 'income',
      },
      {
        category: notOwnedCategory,
        amount: 5000,
        type: 'income',
      },
    ];
    const fakeRefund = [
      {
        category: notOwnedCategory,
        amount: 350,
        type: 'refund',
      },
    ];

    const expenses = [
      {
        category: category1,
        amount: 3500,
        type: 'expense',
      },
      {
        category: category1,
        amount: 800,
        type: 'expense',
      },
      {
        category: category2,
        amount: 3500,
        type: 'expense',
      },
      {
        category: category2,
        amount: 954,
        type: 'expense',
      },
      {
        category: category2,
        amount: 88,
        type: 'expense',
      },
      {
        category: null,
        amount: 650,
        type: 'expense',
      },
    ];
    const income = [
      {
        category: null,
        amount: 88,
        type: 'income',
      },
      {
        category: null,
        amount: 8938,
        type: 'income',
      },
    ];
    const refund = [
      {
        category: category2,
        amount: 488,
        type: 'refund',
      },
      {
        category: category2,
        amount: 395,
        type: 'refund',
      },
      {
        category: category1,
        amount: 999,
        type: 'refund',
      },
      {
        category: null,
        amount: 50,
        type: 'refund',
      },
    ];

    await Promise.all(
      [fakeExpense, fakeIncome, fakeRefund, expenses, income, refund].map(
        async (type) =>
          await Promise.all(
            type.map((expense) => {
              const transaction = new Transaction();
              transaction.amount = expense.amount;
              transaction.paidAt = '2018-01-02';
              transaction.type = expense.type;
              transaction.category = expense.category;
              transaction.userId = expense.category?.userId || 'fake-user';

              return transactionRepo.save(transaction);
            }),
          ),
      ),
    );

    return request(app.getHttpServer())
      .get('/analytics?start=2018&end=2018')
      .expect(200)
      .expect(({ body }) => {
        expect(body.income.total).toBe(9026);
        expect(body.income.byCategory).toStrictEqual([
          { categoryId: null, categoryName: null, amount: 9026 },
        ]);
        expect(body.expense.total).toBe(7560);
        expect(body.expense.byCategory).toStrictEqual([
          {
            categoryId: null,
            categoryName: null,
            amount: 600,
          },
          {
            categoryId: category1.id,
            categoryName: category1.name,
            amount: 3301,
          },
          {
            categoryId: category2.id,
            categoryName: category2.name,
            amount: 3659,
          },
        ]);
      });
  });
});
