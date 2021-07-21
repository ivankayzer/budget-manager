import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/auth/dto/user.dto';
import { DeleteResult, In, Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  getById(userId: string, id: number): Promise<Category | undefined> {
    return this.categoryRepository.findOne({ id, userId });
  }

  getByIds(userId: string, ids: number[]): Promise<Category[]> {
    return this.categoryRepository.find({
      where: {
        id: In(ids),
        userId,
      },
    });
  }

  getAll(dto: UserDto): Promise<Category[]> {
    return this.categoryRepository.find({ userId: dto.userId });
  }

  createCategory(dto: CreateCategoryDto): Promise<Category> {
    const category = new Category();
    category.name = dto.name;
    category.userId = dto.userId;

    return this.categoryRepository.save(category);
  }

  updateCategoryById(id: number, dto: UpdateCategoryDto): Promise<Category> {
    return this.categoryRepository
      .findOne({
        id,
        userId: dto.userId,
      })
      .then((category: Category) => {
        category.name = dto.name;
        return this.categoryRepository.save(category);
      });
  }

  deleteCategoryById(id: number, dto: UserDto): Promise<DeleteResult> {
    return this.categoryRepository.delete({
      id,
      userId: dto.userId,
    });
  }
}
