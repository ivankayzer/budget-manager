import { Category } from './src/categories/category.entity';
import { Transaction } from './src/transactions/transaction.entity';
import { getRepository, createConnection } from 'typeorm';
import categoryFactory from './test/factories/category';
import transactionFactory from './test/factories/transaction';
import { BudgetScheduler as budgetSchedulerFactory } from './test/factories/budget';
import { Budget as budgetFactory } from './test/factories/budget';
import { random, datatype } from 'faker';
import { Budget } from 'src/budgets/budget.entity';
import { BudgetScheduler } from 'src/budgets/budget-scheduler.entity';

const seed = async () => {
  await createConnection();
  const categoryRepo = getRepository(Category);
  const transactionRepo = getRepository(Transaction);
  const budgetRepo = getRepository(Budget);
  const budgetSchedulerRepo = getRepository(BudgetScheduler);

  const categories: Category[] = [null];
  for (let i = 0; i < 5; i++) {
    categories.push(await categoryRepo.save(categoryFactory.build()));
  }

  for (let i = 0; i < 135; i++) {
    const category = random.arrayElement(categories);

    await transactionRepo.save(transactionFactory.build({ category }));
  }

  const scheduler = await budgetSchedulerRepo.save(
    budgetSchedulerFactory.build({
      categories: random.arrayElements(
        categories.filter(Boolean),
        datatype.number({ min: 0, max: 2 }),
      ),
    }),
  );

  await budgetRepo.save(budgetFactory.build({ scheduler }));

  console.log('Successfully seeded database.');
  process.exit(0);
};

seed();
