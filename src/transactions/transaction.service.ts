import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../auth/dto/user.dto';
import { Between, DeleteResult, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transaction.entity';
import { CategoryService } from '../categories/category.service';
import { DateCreator } from '../date-creator';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private categoryService: CategoryService,
    private dateCreator: DateCreator,
  ) {}

  getTransactionForDateRange(
    userId: string,
    start?: string,
    end?: string,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      order: {
        paidAt: 'DESC',
      },
      where: {
        userId: userId,
        paidAt: Between(...this.dateCreator.createBetween(start, end)),
      },
    });
  }

  public async getById(userId: string, id: number): Promise<Transaction> {
    return this.transactionRepository.findOne({
      id,
      userId,
    });
  }

  async createTransaction(dto: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.amount = dto.amount;
    transaction.description = dto.description || '';
    transaction.userId = dto.userId;
    transaction.paidAt = dto.paidAt;
    transaction.type = dto.type;

    if (dto.categoryId) {
      const category = await this.categoryService.getById(
        dto.userId,
        dto.categoryId,
      );
      transaction.category = category;
    }

    return this.transactionRepository.save(transaction);
  }

  async updateTransactionById(
    id: number,
    dto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      id,
      userId: dto.userId,
    });

    transaction.amount = dto.amount;
    transaction.description = dto.description || '';
    transaction.paidAt = dto.paidAt;
    transaction.type = dto.type;

    if (dto.categoryId) {
      const category = await this.categoryService.getById(
        dto.userId,
        dto.categoryId,
      );
      transaction.category = category;
    }

    return this.transactionRepository.save(transaction);
  }

  deleteTransactionById(id: number, dto: UserDto): Promise<DeleteResult> {
    return this.transactionRepository.delete({
      id,
      userId: dto.userId,
    });
  }
}
