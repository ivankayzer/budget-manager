import { parse } from '@fast-csv/parse';
import * as fs from 'fs';
import * as readline from 'readline';
import { Category } from './src/categories/category.entity';
import { Transaction } from './src/transactions/transaction.entity';
import { createConnection, getRepository } from 'typeorm';

const FILE = process.cwd() + '/transactions.csv';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const transform = (row) => {
  const transformAmount = (a: string) => {
    a = a.replace('-', '');

    if (!a.includes('.')) {
      return Number(a + '00');
    }

    let [x, y] = a.split('.');

    if (y.length === 1) {
      y += '0';
    }

    return Number(x + y);
  };

  return {
    paidAt: row.Date,
    description: row.Description,
    amount: transformAmount(row.Amount),
    type: row.Type.toLowerCase(),
    category: row.Tags.split(',')
      .map((tag) => tag.split(' / ')[0])[0]
      .trim(),
  };
};

(async () => {
  rl.question('Please provide your UserID: ', async (userId) => {
    userId = userId.trim();
    console.log(`Your UserID is ${userId}`);

    await createConnection();
    const categoryRepo = getRepository(Category);
    const transactionsRepo = getRepository(Transaction);

    rl.close();

    let transformed = [];

    await new Promise<number>((resolve) => {
      const stream = parse({ headers: true })
        .on('error', (error) => console.error(error))
        .on('data', (row) => {
          transformed.push(transform(row));
        })
        .on('end', resolve);

      stream.write(fs.readFileSync(FILE));
      stream.end();
    });

    const categoriesSet = new Set(
      transformed.filter((t) => t.category).map((t) => t.category),
    );

    await Promise.all(
      [...categoriesSet].map(async (name) => {
        const existingCategory = await categoryRepo.findOne({
          userId,
          name,
        });

        if (!existingCategory) {
          const newCategory = new Category();
          newCategory.name = name;
          newCategory.userId = userId;
          return categoryRepo.save(newCategory);
        }

        return new Promise((resolve) => resolve(null));
      }),
    );

    const categoryModels = await categoryRepo.find({ userId });
    const categoriesByKey = {};

    categoryModels.forEach((category) => {
      categoriesByKey[category.name] = category;
    });

    await Promise.all(
      transformed
        .filter((t) => t.type !== 'transfer')
        .map(async (t) => {
          const transaction = new Transaction();
          transaction.amount = t.amount;
          transaction.userId = userId;
          transaction.description = t.description;
          transaction.paidAt = t.paidAt;
          transaction.type = t.type;

          if (t.category) {
            transaction.category = categoriesByKey[t.category];
          }

          await transactionsRepo.save(transaction);
        }),
    );

    process.exit(0);
  });
})();
