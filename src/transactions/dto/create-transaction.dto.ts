import { IsDateString, IsIn, IsInt, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  userId: string;

  @IsInt()
  amount: number;

  @IsIn(['refund', 'income', 'expense'])
  type: string;

  @IsDateString()
  paidAt: string;

  @IsString()
  description: string;
}
