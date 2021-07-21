import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BodyWithUserId } from 'src/auth/body-with-user.decorator';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Controller('budgets')
@UseGuards(AuthGuard('jwt'))
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  createBudget(@BodyWithUserId() dto: CreateBudgetDto) {
    if (!dto.end) {
      this.budgetService.createScheduledBudget(dto);
    } else {
      this.budgetService.createBudget(dto);
    }
  }
}
