import {
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  Delete,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BodyWithUserId } from '../auth/body-with-user.decorator';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryTransformer } from './category.transformer';
import { UserDto } from '../auth/dto/user.dto';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly categoryTransformer: CategoryTransformer,
  ) {}

  @Get()
  categories(@BodyWithUserId() dto: UserDto) {
    return this.categoryService
      .getAll(dto)
      .then((categories) => categories.map(this.categoryTransformer.transform));
  }

  @Post()
  createCategory(@BodyWithUserId() dto: CreateCategoryDto) {
    return this.categoryService
      .createCategory(dto)
      .then(this.categoryTransformer.transform);
  }

  @Patch(':id')
  updateCategory(
    @BodyWithUserId() dto: UpdateCategoryDto,
    @Param('id') id: number,
  ) {
    return this.categoryService
      .updateCategoryById(id, dto)
      .then(this.categoryTransformer.transform);
  }

  @Delete(':id')
  deleteCategory(@BodyWithUserId() dto: UserDto, @Param('id') id: number) {
    this.categoryService.deleteCategoryById(id, dto);
  }
}
