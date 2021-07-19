import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BodyWithUserId } from '../auth/body-with-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
// @UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getAnalytics() {
    const totalIncome = this.analyticsService.getTotalIncome('fake-user', [
      '2021-07-01',
      '2021-07-31',
    ]);
    const totalExpense = this.analyticsService.getTotalExpenses('fake-user', [
      '2021-07-01',
      '2021-07-31',
    ]);
    const incomeByCategory = this.analyticsService.getIncomeByCategories(
      'fake-user',
      ['2021-07-01', '2021-07-31'],
    );
    const expenseByCategory = this.analyticsService.getExpensesByCategory(
      'fake-user',
      ['2021-07-01', '2021-07-31'],
    );

    return Promise.all([
      totalIncome,
      totalExpense,
      incomeByCategory,
      expenseByCategory,
    ]).then(
      ({
        0: totalIncome,
        1: totalExpense,
        2: incomeByCategory,
        3: expenseByCategory,
      }) => {
        return {
          income: {
            total: totalIncome,
            byCategory: incomeByCategory,
          },
          expense: {
            total: totalExpense,
            byCategoty: expenseByCategory,
          },
        };
      },
    );
  }
}
