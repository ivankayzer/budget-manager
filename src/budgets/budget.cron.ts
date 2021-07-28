import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addDays } from 'date-fns';
import { DateCreator } from '../date-creator';
import { BudgetService } from './budget.service';
import { ScheduledBudgetRow } from './interfaces/scheduled-budget-row';

@Injectable()
export class BudgetCron {
  constructor(
    private budgetService: BudgetService,
    private dateCreator: DateCreator,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async generateScheduledBudgets() {
    const budgets = await this.budgetService.getScheduledBudgetsMaxDates();

    console.log(budgets.filter(
      (budget: ScheduledBudgetRow) =>
        this.dateCreator.format(addDays(budget.maxEnd, 1)) ===
        this.dateCreator.today(),
    ));
  }
}
