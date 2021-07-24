import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetScheduler } from './budget-scheduler.entity';
import { Budget } from './budget.entity';
import { BudgetService } from './budget.service';
import { BudgetTransformer } from './budget.transformer';
import { CategoryModule } from '../categories/category.module';
import { BudgetController } from './budget.controller';
import { BudgetSchedulerCalculator } from './budget-scheduler-calculator';
import { DateCreator } from '../date-creator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, BudgetScheduler]),
    CategoryModule,
  ],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetTransformer, DateCreator, BudgetSchedulerCalculator],
  exports: [TypeOrmModule],
})
export class BudgetModule {}
