import {
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BodyWithUserId } from '../auth/body-with-user.decorator';
import { BudgetService } from './budget.service';
import { BudgetTransformer } from './budget.transformer';
import { CreateBudgetRequest } from './dto/create-budget-request.dto';
import { DeleteBudgetRequest } from './dto/delete-budget-request.dto';
import { UpdateBudgetRequest } from './dto/update-budget-request.dto';

@Controller('budgets')
@UseGuards(AuthGuard('jwt'))
export class BudgetController {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly budgetTransformer: BudgetTransformer,
  ) {}

  @Post()
  create(@BodyWithUserId() dto: CreateBudgetRequest) {
    return this.budgetService
      .createBudget(dto)
      .then((budget) => this.budgetTransformer.transform(budget));
  }

  @Patch(':id')
  update(@BodyWithUserId() dto: UpdateBudgetRequest, @Param('id') id: number) {
    return this.budgetService
      .updateBudgetById(id, dto)
      .then((budget) => this.budgetTransformer.transform(budget));
  }

  @Delete(':id')
  delete(@BodyWithUserId() dto: DeleteBudgetRequest, @Param('id') id: number) {
    this.budgetService.deleteBudgetById(id, dto);
  }
}
