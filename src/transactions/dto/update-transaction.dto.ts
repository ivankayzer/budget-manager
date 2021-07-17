import { IsDateString, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
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

  @IsOptional()
  @IsInt()
  categoryId: number | null;
}
