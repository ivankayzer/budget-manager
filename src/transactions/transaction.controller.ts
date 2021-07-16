import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BodyWithUserId } from 'src/auth/body-with-user.decorator';
import { UserDto } from 'src/auth/dto/user.dto';
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
  getTransactionForCurrentMonth(@BodyWithUserId() dto: UserDto) {
    return this.transactionService
      .getTransactionsForCurrentMonth(dto)
      .then((transactions) =>
        transactions.map(this.transactionTransformer.transform),
      );
  }

  @Post()
  createTransaction(@BodyWithUserId() dto: CreateTransactionDto) {
    return this.transactionService
      .createTransaction(dto)
      .then(this.transactionTransformer.transform);
  }

  @Patch(':id')
  updateCategory(
    @BodyWithUserId() dto: UpdateTransactionDto,
    @Param('id') id: number,
  ) {
    return this.transactionService
      .updateTransactionById(id, dto)
      .then(this.transactionTransformer.transform);
  }

  @Delete(':id')
  deleteCategory(@BodyWithUserId() dto: UserDto, @Param('id') id: number) {
    this.transactionService.deleteTransactionById(id, dto);
  }
}
