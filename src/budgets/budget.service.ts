import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/categories/category.service';
import { Repository } from 'typeorm';
import { BudgetSchedulerCalculator } from './budget-scheduler-calculator';
import { BudgetScheduler } from './budget-scheduler.entity';
import { Budget } from './budget.entity';
import { CreateBudgetRequest } from './dto/create-budget-request.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetScheduler)
    private budgetSchedulerRepository: Repository<BudgetScheduler>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    private categoryService: CategoryService,
    private budgetSchedulerCalculator: BudgetSchedulerCalculator,
  ) {}

  public async createBudget(dto: CreateBudgetRequest) {
    let scheduler = null;

    if (!dto.end) {
      scheduler = await this.createScheduledBudget(dto);
      dto.end = this.budgetSchedulerCalculator.calculateEndFromStart(
        scheduler,
        dto.start,
      );
    }

    const budget = await this.createBudgetModel(dto, scheduler);

    return this.budgetRepository.save(budget);
  }

  private async createScheduledBudget(dto: CreateBudgetRequest) {
    const scheduler = new BudgetScheduler();

    scheduler.start = dto.start;
    scheduler.amount = dto.amount;
    scheduler.repeat = dto.repeat;
    scheduler.rollover = dto.rollover;
    scheduler.userId = dto.userId;

    if (dto.categoryIds) {
      scheduler.categories = await this.categoryService.getByIds(
        dto.userId,
        dto.categoryIds,
      );
    }

    return this.budgetSchedulerRepository.save(scheduler);
  }

  private async createBudgetModel(
    dto: CreateBudgetRequest,
    scheduler?: BudgetScheduler | null,
  ) {
    const budget = new Budget();

    budget.start = dto.start;
    budget.end = dto.end;
    budget.amount = dto.amount;
    budget.userId = dto.userId;

    if (dto.categoryIds) {
      budget.categories = await this.categoryService.getByIds(
        dto.userId,
        dto.categoryIds,
      );
    }

    budget.scheduler = scheduler;

    return budget;
  }
}
