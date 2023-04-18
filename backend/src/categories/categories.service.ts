import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { FilesService } from 'src/files/files.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/CreateCategory.dto';
import { UpdateCategoryDto } from './dto/UpdateCategory.dto';
import { Category } from './entities/category.entity';

export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private filesService: FilesService,
  ) {}

  async createOne(
    user: User,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = new Category();

    category.name = createCategoryDto.name;
    category.photos = await this.filesService.findManyByUrls(
      createCategoryDto.photoUrls,
    );
    category.tools = [];
    category.createdBy = user;

    return await this.categoriesRepository.save(category);
  }

  async updateOne(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category | undefined> {
    const category = await this.findOneById(id);

    if (!category) return undefined;

    if (updateCategoryDto.name) {
      category.name = updateCategoryDto.name;
    }

    if (updateCategoryDto.photoUrls) {
      category.photos = await this.filesService.findManyByUrls(
        updateCategoryDto.photoUrls,
      );
    }

    await this.categoriesRepository.save(category);

    return category;
  }

  async deleteOne(id: number) {
    const category = await this.findOneById(id);
    if (category) {
      return await this.categoriesRepository.remove(category);
    }
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Category>> {
    const queryBuilder = this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.photos', 'file')
      .orderBy('category.created', 'DESC');

    return paginate<Category>(queryBuilder, options);
  }

  async findByIds(ids: number[]): Promise<Category[]> {
    return await this.categoriesRepository.findByIds(ids);
  }

  async findOneById(id: number): Promise<Category | undefined> {
    return await this.categoriesRepository.findOne(id);
  }
}
