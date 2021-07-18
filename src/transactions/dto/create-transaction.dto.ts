import { IsDateString, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  userId: string;

  @IsInt()
  amount: number;

  @IsIn(['refund', 'income', 'expense'])
  type: string;

  @IsDateString()
  paidAt: string;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsInt()
  categoryId: number | null;
}
