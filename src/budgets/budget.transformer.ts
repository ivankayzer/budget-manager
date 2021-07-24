import { Injectable } from '@nestjs/common';
import { Budget } from './budget.entity';

@Injectable()
export class BudgetTransformer implements EntityTransformer {
  transform(budget: Budget) {
    return {
      id: budget.id,
      start: budget.start,
      end: budget.end,
      amount: budget.amount,
      createdAt: budget.createdAt,
    };
  }
}
