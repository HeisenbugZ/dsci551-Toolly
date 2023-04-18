import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CategoriesService } from 'src/categories/categories.service';
import { FilesService } from 'src/files/files.service';
import { GeocodeService } from 'src/geocode/geocode.service';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateToolDto } from './dto/CreateTool.dto';
import { ToolsPaginatedQuery } from './dto/ToolsPaginatedQuery.dto';
import { UpdateToolDto } from './dto/UpdateTool.dto';
import { Tool } from './entities/tool.entity';

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(Tool)
    private toolsRepository: Repository<Tool>,
    private filesService: FilesService,
    private categoriesSerivce: CategoriesService,
    private geocodeService: GeocodeService,
  ) {}

  async createOne(user: User, createToolDto: CreateToolDto): Promise<Tool> {
    const tool = new Tool();
    tool.user = user;
    tool.name = createToolDto.name;
    tool.introduction = createToolDto.introduction;
    tool.photos = await this.filesService.findManyByUrls(
      createToolDto.photoUrls,
    );
    tool.categories = await this.categoriesSerivce.findByIds(
      createToolDto.categoryIds,
    );

    return await this.toolsRepository.save(tool);
  }

  async findOne(id: number): Promise<Tool | undefined> {
    return await this.toolsRepository.findOne(id, {
      relations: ['user', 'photos', 'categories'],
    });
  }

  async findAll(options: ToolsPaginatedQuery) {
    let queryBuilder = this.toolsRepository
      .createQueryBuilder('tool')
      .leftJoinAndSelect('tool.user', 'user');

    if (options.category) {
      queryBuilder = queryBuilder
        .leftJoinAndSelect('tool.categories', 'category')
        .andWhere('category.id = :categoryId', {
          categoryId: options.category,
        });
    }

    if (options.user) {
      queryBuilder = queryBuilder.andWhere('"userId" = :userId', {
        userId: options.user,
      });
    }

    if (options.zipcode) {
      const response = await this.geocodeService.geocode({
        address: options.zipcode,
      });

      if (response?.length) {
        const { latitude, longitude } = response[0];

        queryBuilder = queryBuilder.orderBy(
          `POWER(user.latitude - ${Number(
            latitude,
          )}, 2) + POWER(user.longitude - ${Number(longitude)}, 2)`,
        );
      } else {
        console.warn(`No address found for zipcode ${options.zipcode}`);
        queryBuilder = queryBuilder.orderBy('tool.created');
      }
    } else {
      queryBuilder = queryBuilder.orderBy('tool.created');
    }

    const tools = await paginate<Tool>(queryBuilder, options);

    for (const tool of tools.items) {
      const fullTool = await this.findOne(tool.id);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      tool.categories = fullTool?.categories!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      tool.photos = fullTool?.photos!;
    }

    return tools;
  }

  async findOwn(
    user: User,
    options: ToolsPaginatedQuery,
  ): Promise<Pagination<Tool>> {
    const queryBuilder = this.toolsRepository
      .createQueryBuilder('tool')
      .orderBy('tool.created', 'DESC')
      .where('"userId" = :userId', { userId: user.id });

    const tools = await paginate<Tool>(
      options.category
        ? queryBuilder.andWhere('"category.id" = :categoryId', {
            categoryId: options.category,
          })
        : queryBuilder,
      options,
    );

    for (const tool of tools.items) {
      const fullTool = await this.findOne(tool.id);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      tool.categories = fullTool?.categories!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      tool.photos = fullTool?.photos!;
    }

    return tools;
  }

  async findOneOwn(user: User, toolId: number): Promise<Tool | undefined> {
    const tool = await this.toolsRepository.findOne({
      where: {
        id: toolId,
        user: {
          id: user.id,
        },
      },
    });
    return tool;
  }

  async deleteOneOwn(user: User, toolId: number): Promise<DeleteResult> {
    return await this.toolsRepository.delete({
      id: toolId,
      user: {
        id: user.id,
      },
    });
  }

  async updateOneOwn(
    user: User,
    id: number,
    updateToolDto: UpdateToolDto,
  ): Promise<Tool | undefined> {
    const tool = await this.findOneOwn(user, id);
    if (!tool) return undefined;

    if (updateToolDto.name) {
      tool.name = updateToolDto.name;
    }
    if (updateToolDto.introduction) {
      tool.introduction = updateToolDto.introduction;
    }
    if (updateToolDto.photoUrls) {
      tool.photos = await this.filesService.findManyByUrls(
        updateToolDto.photoUrls,
      );
    }
    if (updateToolDto.categoryIds) {
      tool.categories = await this.categoriesSerivce.findByIds(
        updateToolDto.categoryIds,
      );
    }
    return await this.toolsRepository.save(tool);
  }
}
