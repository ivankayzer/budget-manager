import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/auth/dto/user.dto';
import { Between, DeleteResult, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transaction.entity';
import { format, addMonths } from 'date-fns';
import { CategoryService } from 'src/categories/category.service';
import { ValidationError } from 'class-validator';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private categoryService: CategoryService,
  ) {}

  getTransactionsForCurrentMonth(dto: UserDto): Promise<Transaction[]> {
    const formatDate = (date) => format(date, 'yyyy-MM-01');

    const date = formatDate(new Date());
    const nextMonth = formatDate(addMonths(new Date(), 1));

    return this.transactionRepository.find({
      userId: dto.userId,
      paidAt: Between(date, nextMonth),
    });
  }

  async createTransaction(dto: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.amount = dto.amount;
    transaction.description = dto.description;
    transaction.userId = dto.userId;
    transaction.paidAt = dto.paidAt;
    transaction.type = dto.type;

    if (dto.categoryId) {
      const category = await this.categoryService.getById(dto.categoryId);
      transaction.category = category;
    }

    return this.transactionRepository.save(transaction);
  }

  updateTransactionById(
    id: number,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionRepository
      .findOne({
        id,
        userId: dto.userId,
      })
      .then((transaction: Transaction) => {
        transaction.amount = dto.amount;
        transaction.description = dto.description;
        transaction.paidAt = dto.paidAt;
        transaction.type = dto.type;

        return this.transactionRepository.save(transaction);
      });
  }

  deleteTransactionById(id: number, dto: UserDto): Promise<DeleteResult> {
    return this.transactionRepository.delete({
      id,
      userId: dto.userId,
    });
  }
}
