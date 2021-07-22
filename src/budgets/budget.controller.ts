import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BodyWithUserId } from 'src/auth/body-with-user.decorator';
import { BudgetService } from './budget.service';
import { CreateBudgetRequest } from './dto/create-budget-request.dto';

@Controller('budgets')
@UseGuards(AuthGuard('jwt'))
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  createBudget(@BodyWithUserId() dto: CreateBudgetRequest) {
    this.budgetService.createBudget(dto);
  }
}
