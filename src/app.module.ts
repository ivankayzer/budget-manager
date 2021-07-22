import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BudgetModule } from './budgets/budget.module';
import { CategoryModule } from './categories/category.module';
import { DateCreator } from './date-creator';
import { TransactionModule } from './transactions/transaction.module';

@Module({
  imports: [
    AuthModule,
    CategoryModule,
    TransactionModule,
    AnalyticsModule,
    BudgetModule,
    TypeOrmModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, DateCreator],
})
export class AppModule {}
