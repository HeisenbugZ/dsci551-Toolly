import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.authService.authorizeRequest(request);
  }
}
