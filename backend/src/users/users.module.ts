import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAlreadyExists, UserExists } from './validators/UserExists';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { GeocodeModule } from 'src/geocode/geocode.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    FilesModule,
    GeocodeModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserAlreadyExists, UserExists],
  exports: [UsersService],
})
export class UsersModule {}
