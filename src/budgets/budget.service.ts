import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'src/categories/category.service';
import { Repository } from 'typeorm';
import { BudgetScheduler } from './budget-scheduler.entity';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetScheduler)
    private budgetSchedulerRepository: Repository<BudgetScheduler>,
    private categoryService: CategoryService,
  ) {}

  async createScheduledBudget(dto: CreateBudgetDto) {
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

    this.budgetSchedulerRepository.save(scheduler);
  }

  createBudget(dto: CreateBudgetDto) {}
}
