import { Injectable } from '@nestjs/common';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionTransformer implements EntityTransformer {
  transform(transaction: Transaction) {
    return {
      id: transaction.id,
      amount: transaction.amount,
      paidAt: transaction.paidAt,
      description: transaction.description,
      type: transaction.type,
      createdAt: transaction.createdAt,
    };
  }
}
