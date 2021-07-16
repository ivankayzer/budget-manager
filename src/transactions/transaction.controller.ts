import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionService } from './transaction.service';
import { TransactionTransformer } from './transaction.transformer';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionTransformer: TransactionTransformer,
  ) {}
}
