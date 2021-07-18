import { Category } from 'src/categories/category.entity';
import { Transaction } from 'src/transactions/transaction.entity';
import { getRepository, createConnection } from 'typeorm';
import categoryFactory from './test/factories/category';
import transactionFactory from './test/factories/transaction';
import { random } from 'faker';

const seed = async () => {
  await createConnection();
  const categoryRepo = getRepository(Category);
  const transactionRepo = getRepository(Transaction);

  const categories: Category[] = [null];
  for (let i = 0; i < 5; i++) {
    categories.push(await categoryRepo.save(categoryFactory.build()));
  }

  for (let i = 0; i < 135; i++) {
    const category = random.arrayElement(categories);

    await transactionRepo.save(transactionFactory.build({ category }));
  }

  process.exit(0);
};

seed();
