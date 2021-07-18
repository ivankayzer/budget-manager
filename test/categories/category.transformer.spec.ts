import { Category } from '../../src/categories/category.entity';
import { CategoryTransformer } from '../../src/categories/category.transformer';

describe('CategoryTransformer', () => {
  it('transforms a category', () => {
    const category = new Category();
    category.id = 5;
    category.name = 'fake-category';
    const date = new Date(1, 1, 1, 1, 1, 1);
    category.createdAt = date;

    const transformed = new CategoryTransformer().transform(category);
    expect(transformed).toStrictEqual({
      id: 5,
      name: 'fake-category',
      createdAt: date,
    });
  });
});
