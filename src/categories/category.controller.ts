import { Controller, Post, UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { BodyWithUserId } from "src/auth/body-with-user.decorator";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller()
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post('/categories')
    createCategory(@BodyWithUserId() dto: CreateCategoryDto): void {
      this.categoryService.createCategory(dto);
    }
}