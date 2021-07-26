import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../categories/category.service';
import { Between, Repository } from 'typeorm';
import { BudgetSchedulerCalculator } from './budget-scheduler-calculator';
import { BudgetScheduler } from './budget-scheduler.entity';
import { Budget } from './budget.entity';
import { CreateBudgetRequest } from './dto/create-budget-request.dto';
import { DeleteBudgetRequest } from './dto/delete-budget-request.dto';
import { UpdateBudgetRequest } from './dto/update-budget-request.dto';
import { DateCreator } from '../date-creator';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetScheduler)
    private budgetSchedulerRepository: Repository<BudgetScheduler>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    private categoryService: CategoryService,
    private budgetSchedulerCalculator: BudgetSchedulerCalculator,
    private dateCreator: DateCreator,
  ) {}

  public async getBudgetsForDateRange(
    userId: string,
    start?: string,
    end?: string,
  ) {
    return this.budgetRepository.find({
      where: [
        {
          start: Between(...this.dateCreator.createBetween(start, end)),
          userId,
        },
        { end: Between(...this.dateCreator.createBetween(start, end)), userId },
      ],
    });
  }

  public async createBudget(dto: CreateBudgetRequest) {
    let scheduler = null;

    if (!dto.end) {
      scheduler = await this.createScheduledBudget(dto);
      dto.end = this.budgetSchedulerCalculator.calculateEndFromStart(
        scheduler.repeat,
        dto.start,
      );
    }

    const budget = await this.createBudgetModel(dto, scheduler);

    return this.budgetRepository.save(budget);
  }

  public async deleteBudgetById(id: number, dto: DeleteBudgetRequest) {
    const { userId } = dto;

    const budget = await this.budgetRepository.findOne({
      id,
      userId,
    });
    const schedulerId = budget.scheduler.id;

    switch (dto.delete) {
      case 'this':
        this.budgetRepository.delete({ id, userId });
        break;
      case 'upcoming':
        this.budgetSchedulerRepository.delete({
          id: schedulerId,
          userId,
        });
        break;
      case 'this-and-upcoming':
        this.budgetRepository.delete({ id, userId });
        this.budgetSchedulerRepository.delete({
          id: schedulerId,
          userId,
        });
        break;
    }
  }

  // @TODO handle case when modifying 'this-and-upcoming' from last month.
  // it should change all budgets with id > 'this'
  public async updateBudgetById(id: number, dto: UpdateBudgetRequest) {
    const { userId } = dto;

    const budget = await this.budgetRepository.findOne({
      id,
      userId,
    });
    const scheduler = budget.scheduler;

    switch (dto.change) {
      case 'this':
        budget.amount = dto.amount;
        this.budgetRepository.save(budget);
        break;
      case 'upcoming':
        scheduler.amount = dto.amount;
        this.budgetSchedulerRepository.save(scheduler);
        break;
      case 'this-and-upcoming':
        budget.amount = dto.amount;
        this.budgetRepository.save(budget);
        scheduler.amount = dto.amount;
        this.budgetSchedulerRepository.save(scheduler);
        break;
    }

    return budget;
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
    budget.scheduler = scheduler;

    if (dto.categoryIds) {
      budget.categories = await this.categoryService.getByIds(
        dto.userId,
        dto.categoryIds,
      );
    }

    return budget;
  }
}
