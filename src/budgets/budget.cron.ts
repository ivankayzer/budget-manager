import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DateCreator } from '../date-creator';
import { BudgetSchedulerCalculator } from './budget-scheduler-calculator';
import { BudgetScheduler } from './budget-scheduler.entity';
import { Budget } from './budget.entity';
import { BudgetService } from './budget.service';
import { ScheduledBudgetRow } from './interfaces/scheduled-budget-row';

@Injectable()
export class BudgetCron {
  constructor(
    private budgetService: BudgetService,
    private dateCreator: DateCreator,
    private budgetSchedulerCalculator: BudgetSchedulerCalculator,
    @InjectRepository(Budget)
    private budgetRepositoty: Repository<Budget>,
    @InjectRepository(BudgetScheduler)
    private budgetSchedulerRepository: Repository<BudgetScheduler>,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  public async generateScheduledBudgets() {
    const budgets = await this.budgetService.getBudgetsToRescedule();

    budgets.forEach(async (budget: ScheduledBudgetRow) => {
      const scheduler = await this.budgetSchedulerRepository.findOne(
        budget.schedulerId,
      );

      const nextBudget = new Budget();
      nextBudget.start = this.dateCreator.today();
      nextBudget.end = this.budgetSchedulerCalculator.calculateEndFromStart(
        budget.repeat,
        nextBudget.start,
      );
      nextBudget.userId = scheduler.userId;
      nextBudget.scheduler = scheduler;
      nextBudget.amount = scheduler.amount;

      this.budgetRepositoty.save(nextBudget);
    });
  }
}
