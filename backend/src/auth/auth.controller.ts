import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { RequestUser } from './decorators/RequestUser.decorator';
import { LoginDto } from './dto/Login.dto';
import { RegisterDto } from './dto/Register.dto';
import { LogoutGuard } from './guards/Logout.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authSerivce.register(registerDto);
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authSerivce.login(loginDto);
    return { token };
  }

  @UseGuards(LogoutGuard)
  @Post('logout')
  async logout(@RequestUser() user: User) {
    return user;
  }
}
