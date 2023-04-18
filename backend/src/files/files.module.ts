import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { File } from './entities/file.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FileExists } from './validators/FileExists';

@Module({
  imports: [TypeOrmModule.forFeature([File]), AuthModule],
  controllers: [FilesController],
  providers: [FilesService, FileExists],
  exports: [FilesService],
})
export class FilesModule {}
