import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { CategoriesService } from 'src/categories/categories.service';
import { User } from 'src/users/entities/user.entity';
import { existsOr404 } from 'src/utils/types';
import { Repository } from 'typeorm';
import { CreateDemandDto } from './dto/CreateDemand.dto';
import { DemandPaginatedQuery as DemandsPaginatedQuery } from './dto/DemandsPaginatedQuery.dto';
import { UpdateDemandDto } from './dto/UpdateDemand.dto';
import { Demand } from './entities/demand.entity';

@Injectable()
export class DemandsService {
  constructor(
    @InjectRepository(Demand)
    private demandRepository: Repository<Demand>,
    private categoriesService: CategoriesService,
  ) {}

  async createOne(user: User, createToolDto: CreateDemandDto): Promise<Demand> {
    const demand = new Demand();

    demand.title = createToolDto.title;
    demand.description = createToolDto.description;
    demand.creator = user;
    demand.categories = await this.categoriesService.findByIds(
      createToolDto.categoryIds,
    );

    return await this.demandRepository.save(demand);
  }

  async findAll(options: DemandsPaginatedQuery) {
    let queryBuilder = this.demandRepository
      .createQueryBuilder('demand')
      .leftJoinAndSelect('demand.categories', 'categories')
      .leftJoinAndSelect('demand.creator', 'creator');

    if (options.category) {
      queryBuilder = queryBuilder.andWhere('category.id = :categoryId', {
        categoryId: options.category,
      });
    }

    if (options.creator) {
      queryBuilder = queryBuilder.andWhere('"creatorId" = :creatorId', {
        creatorId: options.creator,
      });
    }

    return paginate<Demand>(queryBuilder, options);
  }

  async findOneOwn(user: User, id: number): Promise<Demand | undefined> {
    return await this.demandRepository.findOne({
      id,
      creator: user,
    });
  }

  async findOne(id: number): Promise<Demand | undefined> {
    return await this.demandRepository.findOne({
      id,
    });
  }

  async updateOneOwn(
    user: User,
    id: number,
    updateToolDto: UpdateDemandDto,
  ): Promise<Demand> {
    const demand = existsOr404(await this.findOneOwn(user, id));

    updateToolDto.title && (demand.title = updateToolDto.title);
    updateToolDto.description &&
      (demand.description = updateToolDto.description);
    updateToolDto.categoryIds &&
      (demand.categories = await this.categoriesService.findByIds(
        updateToolDto.categoryIds,
      ));

    return demand;
  }

  async deleteOneOwn(user: User, id: number): Promise<void> {
    const demand = existsOr404(await this.findOneOwn(user, id));

    await this.demandRepository.remove(demand);
    return;
  }
}
