import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FilesModule } from 'src/files/files.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CategoryExists } from './validators/CategoryExists';
import { CategoryUniqueName } from './validators/CategoryUniqueName';

@Module({
  imports: [AuthModule, FilesModule, TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoryUniqueName, CategoryExists],
  exports: [CategoriesService],
})
export class CategoriesModule {}
