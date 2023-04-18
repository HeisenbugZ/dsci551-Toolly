import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ToolsModule } from 'src/tools/tools.module';
import { UsersModule } from 'src/users/users.module';
import { Rental } from './entities/rental.entity';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rental]),
    AuthModule,
    UsersModule,
    ToolsModule,
  ],
  controllers: [RentalController],
  providers: [RentalService],
  exports: [RentalService],
})
export class RentalModule {}
