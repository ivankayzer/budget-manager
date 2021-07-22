import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetScheduler } from './budget-scheduler.entity';
import { Budget } from './budget.entity';
import { BudgetService } from './budget.service';
import { BudgetTransformer } from './budget.transformer';
import { CategoryModule } from 'src/categories/category.module';
import { BudgetController } from './budget.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, BudgetScheduler]),
    CategoryModule
  ],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetTransformer],
  exports: [TypeOrmModule],
})
export class BudgetModule {}
