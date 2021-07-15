import { Get, Controller, Post, Req, Body, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Controller()
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post('/categories')
    createCategory(@Req() req: JwtRequest, @Body() dto: CreateCategoryDto): void {
      // @todo create own decorator
      dto.userId = req.user.sub;
      
      this.categoryService.createCategory(dto);
    }
}