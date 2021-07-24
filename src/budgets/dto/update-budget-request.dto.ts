import { IsEnum, IsInt } from 'class-validator';
import { UserDto } from '../../auth/dto/user.dto';
import { BudgetScope } from '../interfaces/budget-scope';

export class UpdateBudgetRequest extends UserDto {
  @IsInt()
  amount: number;

  @IsEnum(BudgetScope)
  change: BudgetScope;
}
