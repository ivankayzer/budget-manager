import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../auth/dto/user.dto';
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

  @Get()
  budgets(
    @BodyWithUserId() dto: UserDto,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.budgetService
      .getBudgetsForDateRange(dto.userId, start, end)
      .then((budgets) =>
        budgets.map((budget) => this.budgetTransformer.transform(budget)),
      );
  }

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
