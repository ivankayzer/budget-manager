import { Factory } from 'fishery';
import { Category } from '../../src/categories/category.entity';
import { format } from 'date-fns';

export default Factory.define<Category>(({ sequence }) => ({
  id: sequence,
  userId: 'fake-user',
  name: 'fake-name',
  createdAt: undefined,
}));
