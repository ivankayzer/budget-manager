import { Injectable } from '@nestjs/common';
import { EntityTransformer } from '../interfaces/entity-transformer';
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
      categoryId: transaction.category?.id || null,
      categoryName: transaction.category?.name || null,
      createdAt: transaction.createdAt,
    };
  }
}
