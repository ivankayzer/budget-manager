import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DateCreator } from '../date-creator';
import { BodyWithUserId } from '../auth/body-with-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly dateCreator: DateCreator,
  ) {}

  @Get()
  async getAnalytics(
    @BodyWithUserId() dto: UserDto,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const dates = this.dateCreator.createBetween(start, end);

    return Promise.all([
      this.analyticsService.getTotalIncome(dto.userId, dates),
      this.analyticsService.getTotalExpenses(dto.userId, dates),
      this.analyticsService.getIncomeByCategories(dto.userId, dates),
      this.analyticsService.getExpensesByCategory(dto.userId, dates),
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
            byCategory: expenseByCategory,
          },
        };
      },
    );
  }
}
