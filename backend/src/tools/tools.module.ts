import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { FilesModule } from 'src/files/files.module';
import { GeocodeModule } from 'src/geocode/geocode.module';
import { Tool } from './entities/tool.entity';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';

@Module({
  imports: [
    AuthModule,
    FilesModule,
    TypeOrmModule.forFeature([Tool]),
    CategoriesModule,
    GeocodeModule,
  ],
  controllers: [ToolsController],
  providers: [ToolsService],
  exports: [ToolsService],
})
export class ToolsModule {}
