import { IsIn, IsString } from 'class-validator';

export class DeleteBudgetRequest {
  @IsString()
  userId: string;

  @IsIn(['upcoming', 'this'])
  delete: 'this' | 'upcoming';
}
