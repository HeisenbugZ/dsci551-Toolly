import type { User } from './src/users/entities/user.entity';

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
