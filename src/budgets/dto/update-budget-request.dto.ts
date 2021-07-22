import { IsIn, IsInt, IsString } from 'class-validator';

export class UpdateBudgetRequest {
  @IsString()
  userId: string;

  @IsInt()
  amount: number;

  @IsIn(['this', 'this-and-upcoming', 'upcoming'])
  change: BudgetScope;
}
