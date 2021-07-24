import { IsEnum } from 'class-validator';
import { UserDto } from '../../auth/dto/user.dto';
import { BudgetScope } from '../interfaces/budget-scope';

export class DeleteBudgetRequest extends UserDto {
  @IsEnum(BudgetScope)
  delete: BudgetScope;
}
