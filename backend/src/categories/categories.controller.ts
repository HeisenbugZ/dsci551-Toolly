import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { RequestUser } from 'src/auth/decorators/RequestUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { LoggedInGuard } from 'src/auth/guards/LoggedIn.guard';

import { Pagination } from 'nestjs-typeorm-paginate';
import {
  ApiPaginatedResponse,
  BasePaginatedQuery,
  existsOr404,
} from 'src/utils/types';
import { AdminGuard } from 'src/auth/guards/Admin.guard';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/UpdateCategory.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @UseGuards(AdminGuard)
  @Post()
  async post(
    @RequestUser() user: User,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.createOne(user, createCategoryDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return existsOr404(
      await this.categoriesService.updateOne(id, updateCategoryDto),
    );
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.deleteOne(id);
    return;
  }

  @Get()
  @ApiPaginatedResponse(Category)
  async get(@Query() query: BasePaginatedQuery): Promise<Pagination<Category>> {
    return await this.categoriesService.findAll(query);
  }
}
