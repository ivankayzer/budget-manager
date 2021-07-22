import { IsIn, IsString } from 'class-validator';

export class DeleteBudgetRequest {
  @IsString()
  userId: string;

  @IsIn(['this', 'this-and-upcoming', 'upcoming'])
  delete: BudgetScope;
}
