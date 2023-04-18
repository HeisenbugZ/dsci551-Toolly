import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { FilesModule } from 'src/files/files.module';
import { Demand } from './entities/demand.entity';
import { DemandsController } from './demands.controller';
import { DemandsService } from './demands.service';

@Module({
  imports: [
    AuthModule,
    FilesModule,
    TypeOrmModule.forFeature([Demand]),
    CategoriesModule,
  ],
  controllers: [DemandsController],
  providers: [DemandsService],
  exports: [DemandsService],
})
export class DemandsModule {}
