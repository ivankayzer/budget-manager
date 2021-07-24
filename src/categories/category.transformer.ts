import { Injectable } from '@nestjs/common';
import { EntityTransformer } from '../interfaces/entity-transformer';
import { Category } from './category.entity';

@Injectable()
export class CategoryTransformer implements EntityTransformer {
  transform(category: Category) {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
    };
  }
}
