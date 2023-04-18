import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from 'src/users/entities/user.entity';

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
