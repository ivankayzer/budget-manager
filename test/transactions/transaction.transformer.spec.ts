import { TransactionTransformer } from '../../src/transactions/transaction.transformer';
import { Category } from '../../src/categories/category.entity';
import transactionFactory from '../factories/transaction';

describe('TransactionTransformer', () => {
  it('transforms a transaction', () => {
    const category = new Category();
    category.id = 5;
    category.name = 'fake-category';

    const transaction = transactionFactory.build({
      id: 34,
      userId: 'fake-user',
      amount: 3456,
      description: 'Fake description',
      createdAt: '2020-01-01',
      type: 'expense',
      paidAt: '2021-01-21',
      category,
    });

    const transformed = new TransactionTransformer().transform(transaction);

    expect(transformed).toMatchObject({
      id: 34,
      amount: 3456,
      description: 'Fake description',
      createdAt: '2020-01-01',
      type: 'expense',
      paidAt: '2021-01-21',
      categoryId: 5,
      categoryName: 'fake-category',
    });
  });

  it('will return null for category fields if not category assigned to a transaction', () => {
    const transaction = transactionFactory.build({
      id: 34,
      userId: 'fake-user',
      amount: 3456,
      description: 'Fake description',
      createdAt: '2020-01-01',
      type: 'expense',
      paidAt: '2021-01-21',
    });

    const transformed = new TransactionTransformer().transform(transaction);

    expect(transformed).toMatchObject({
      id: 34,
      amount: 3456,
      description: 'Fake description',
      createdAt: '2020-01-01',
      type: 'expense',
      paidAt: '2021-01-21',
      categoryId: null,
      categoryName: null,
    });
  });
});
