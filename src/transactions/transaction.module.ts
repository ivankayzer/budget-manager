import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateCreator } from '../date-creator';
import { CategoryModule } from '../categories/category.module';
import { TransactionController } from './transaction.controller';
import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
import { TransactionTransformer } from './transaction.transformer';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), CategoryModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionTransformer, DateCreator],
  exports: [TypeOrmModule],
})
export class TransactionModule {}
