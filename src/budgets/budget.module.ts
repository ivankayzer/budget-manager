import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetController } from './budget.controller';
import { Budget } from './budget.entity';
import { BudgetScheduler } from './budget-scheduler.entity';
import { BudgetService } from './budget.service';
import { BudgetTransformer } from './budget.transformer';
import { CategoryModule } from 'src/categories/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget, BudgetScheduler]),
    CategoryModule,
  ],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetTransformer],
  exports: [TypeOrmModule],
})
export class BudgetModule {}
