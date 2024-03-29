import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Repository } from 'typeorm';
import { TextRow } from './interfaces/text-row';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  public async getTotalIncome(userId: string, dates: [string, string]) {
    return +(await this.getTotals(userId, 'income', dates))[0].amount;
  }

  public async getTotalExpenses(userId: string, dates: [string, string]) {
    const expenses = (await this.getTotals(userId, 'expense', dates))[0].amount;
    const refunds = (await this.getTotals(userId, 'refund', dates))[0].amount;

    return expenses - refunds;
  }

  public async getIncomeByCategories(userId: string, dates: [string, string]) {
    return await (
      await this.getSumByCategory(userId, 'income', dates)
    )
      .map((income: TextRow) => {
        income.amount = +income.amount;
        return income;
      })
      .sort((a, b) => {
        return a.amount > b.amount ? 1 : -1;
      });
  }

  public async getExpensesByCategory(userId: string, dates: [string, string]) {
    const expenses = await this.getSumByCategory(userId, 'expense', dates);
    const refunds = await this.getSumByCategory(userId, 'refund', dates);

    return expenses
      .map((expense: TextRow) => {
        const refundByCategory = refunds.find(
          (refund: TextRow) => refund.categoryId === expense.categoryId,
        );

        if (!refundByCategory) {
          return +expense;
        }

        expense.amount = expense.amount - refundByCategory.amount;
        return expense;
      })
      .sort((a: TextRow, b: TextRow) => (a.amount > b.amount ? 1 : -1));
  }

  private getTotals(
    userId: string,
    type: string,
    dates: [string, string],
  ): Promise<[{ amount: number | null }]> {
    const query: string[] = [
      'SELECT SUM(amount) AS amount FROM transaction WHERE',
      `type = '${type}'`,
      `AND userId = '${userId}'`,
      `AND paidAt >= '${dates[0]}'`,
      `AND paidAt <= '${dates[1]}'`,
    ];

    return this.transactionRepository.query(query.join(' '));
  }

  private getSumByCategory(
    userId: string,
    type: string,
    dates: [string, string],
  ): Promise<TextRow[]> {
    const query: string[] = [
      'SELECT categoryId, category.name AS categoryName, SUM(amount) AS amount FROM transaction',
      'LEFT JOIN category ON category.id = transaction.categoryId WHERE',
      `type = '${type}'`,
      `AND transaction.userId = '${userId}'`,
      `AND paidAt >= '${dates[0]}'`,
      `AND paidAt <= '${dates[1]}'`,
      'GROUP BY categoryId',
    ];

    return this.transactionRepository.query(query.join(' '));
  }
}
