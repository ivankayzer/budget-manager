import { Factory } from 'fishery';
import { Transaction } from '../../src/transactions/transaction.entity';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { lorem, random, date, datatype } from 'faker';

export default Factory.define<Transaction>(() => ({
  id: null,
  userId: 'fake-user',
  amount: datatype.number(100000),
  description: random.arrayElement([null, lorem.words(5)]),
  createdAt: undefined,
  type: random.arrayElement([
    'expense',
    'refund',
    'income',
    'expense',
    'expense',
  ]),
  paidAt: format(
    date.between(startOfMonth(new Date()), endOfMonth(new Date())),
    'yyyy-MM-dd',
  ),
  category: null,
}));
