import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserDto } from '../../auth/dto/user.dto';
import { TransactionType } from '../../transactions/interfaces/transaction-type';

export class CreateTransactionDto extends UserDto {
  @IsInt()
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsDateString()
  paidAt: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  categoryId: number;
}
