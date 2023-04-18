import { ExistsValidator } from 'src/utils/validators';

import { Category } from '../entities/category.entity';

export const CategoryUniqueName = ExistsValidator(Category, 'Category', {
  fieldName: 'name',
  exists: false,
});
