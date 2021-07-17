import { Factory } from 'fishery';
import { Transaction } from '../../src/transactions/transaction.entity';
import { format } from 'date-fns';

export default Factory.define<Transaction>(({ sequence }) => ({
  id: sequence,
  userId: 'fake-user',
  amount: 1000,
  description: 'Fake description',
  createdAt: undefined,
  type: 'expense',
  paidAt: format(new Date(), 'yyyy-MM-15'),
  category: null,
}));
