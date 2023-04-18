import { ExistsValidator } from 'src/utils/validators';

import { Category } from '../entities/category.entity';

export const CategoryExists = ExistsValidator(Category, 'Category');
