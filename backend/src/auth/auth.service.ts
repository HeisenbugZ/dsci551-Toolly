import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/Register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { randomBytes } from 'node:crypto';
import { LoginDto } from './dto/Login.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
    private configService: ConfigService<Config>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });

    if (user) {
      return await bcrypt.compare(password, user.hashedPassword);
    } else {
      return null;
    }
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  sha256(s: string) {
    return crypto.createHash('sha256').update(s).digest().toString('base64');
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const user = new User();
    user.name = registerDto.name;
    user.email = registerDto.email;
    user.zipcode = registerDto.zipcode;
    user.address = registerDto.address;
    user.hashedPassword = await this.hashPassword(registerDto.password);

    return await this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    if (
      !bcrypt.compare(
        loginDto.password,
        this.configService.get('MASTER_PASSWORD')!,
      ) &&
      !(await this.validateUser(loginDto.email, loginDto.password))
    ) {
      throw new HttpException(
        `Email or password is incorrect. `,
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.usersRepository.findOne({ email: loginDto.email });

    const tokenString = randomBytes(16).toString('base64url');

    const token = new Token();
    token.hashedToken = this.sha256(tokenString);
    token.user = user!;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7); // Expries the token after 7 days
    token.expiry = expiry;
    await this.tokensRepository.save(token);
    return tokenString;
  }

  async ensureToken(request: Request, valid = true): Promise<Token> {
    const authorization = request.headers['authorization'] as string;

    if (authorization == null) {
      throw new HttpException(
        `Place a header Authorization: Bearer <YOUR_TOKEN> for protected routes`,
        HttpStatus.FORBIDDEN,
      );
    }
    const inputToken = authorization.slice('Bearer '.length);

    const hashedToken = this.sha256(inputToken);

    const token = await this.tokensRepository.findOne(hashedToken, {
      relations: ['user'],
    });

    if (!token) {
      throw new HttpException(`Invalid token`, HttpStatus.FORBIDDEN);
    }

    if (valid) {
      if (token.expiry.getTime() < Date.now()) {
        throw new HttpException(
          `Your session has expired. Please log in again.`,
          HttpStatus.FORBIDDEN,
        );
      }
    }

    return token;
  }

  async authorizeRequest(request: Request) {
    const token = await this.ensureToken(request);
    request.user = token.user;
    return true;
  }

  async invalidateRequestAuth(request: Request) {
    const token = await this.ensureToken(request, false);

    await this.tokensRepository.remove(token);
    return true;
  }
}
