import { Factory } from 'fishery';
import { Category } from '../../src/categories/category.entity';
import { lorem } from 'faker';

export default Factory.define<Category>(() => ({
  id: null,
  userId: 'fake-user',
  name: lorem.word(),
  createdAt: undefined,
}));
