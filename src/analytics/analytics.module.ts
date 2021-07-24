import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DateCreator } from '../date-creator';
import { Transaction } from '../transactions/transaction.entity';
import { TransactionModule } from '../transactions/transaction.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), TransactionModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService, DateCreator],
})
export class AnalyticsModule {}
