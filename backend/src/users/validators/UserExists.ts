import { ExistsValidator } from 'src/utils/validators';

import { User } from '../entities/user.entity';

export const UserAlreadyExists = ExistsValidator(User, 'User', {
  fieldName: 'email',
  exists: false,
});

export const UserExists = ExistsValidator(User, 'User', {
  fieldName: 'id',
  exists: true,
});
