import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/auth/dto/user.dto';
import { DeleteResult, Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  getAll(dto: UserDto): Promise<Transaction[]> {
    return this.transactionRepository.find({ userId: dto.userId });
  }

  createTransaction(dto: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.amount = dto.amount;
    transaction.description = dto.description;
    transaction.userId = dto.userId;
    transaction.paidAt = dto.paidAt;
    transaction.type = dto.type;

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
