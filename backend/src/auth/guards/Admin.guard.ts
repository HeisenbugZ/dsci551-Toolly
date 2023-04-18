import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { LoggedInGuard } from './LoggedIn.guard';

@Injectable()
export class AdminGuard extends LoggedInGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    if (request.user == null) {
      super.canActivate(context);
    }

    return request.user?.role === 'admin';
  }
}
