import {
  IsIn,
} from 'class-validator';
import { CreateBudgetRequest } from './create-budget-request.dto';

export class UpdateBudgetRequest extends CreateBudgetRequest {
  @IsIn(['upcoming', 'this'])
  change: 'this' | 'upcoming';
}
