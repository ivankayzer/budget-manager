import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BodyWithUserId } from '../auth/body-with-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionService } from './transaction.service';
import { TransactionTransformer } from './transaction.transformer';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionTransformer: TransactionTransformer,
  ) {}

  @Get()
  getTransactionForCurrentMonth(
    @BodyWithUserId() dto: UserDto,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.transactionService
      .getTransactionForDateRange(dto.userId, start, end)
      .then((transactions) =>
        transactions.map(this.transactionTransformer.transform),
      );
  }

  @Get(':id')
  transaction(@BodyWithUserId() dto: UserDto, @Param('id') id: number) {
    return this.transactionService
      .getById(dto.userId, id)
      .then(this.transactionTransformer.transform);
  }

  @Post()
  createTransaction(@BodyWithUserId() dto: CreateTransactionDto) {
    return this.transactionService
      .createTransaction(dto)
      .then(this.transactionTransformer.transform);
  }

  @Patch(':id')
  updateTransaction(
    @BodyWithUserId() dto: UpdateTransactionDto,
    @Param('id') id: number,
  ) {
    return this.transactionService
      .updateTransactionById(id, dto)
      .then(this.transactionTransformer.transform);
  }

  @Delete(':id')
  deleteTransaction(@BodyWithUserId() dto: UserDto, @Param('id') id: number) {
    this.transactionService.deleteTransactionById(id, dto);
  }
}
