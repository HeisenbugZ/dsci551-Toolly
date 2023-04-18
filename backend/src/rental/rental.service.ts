import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

import { UsersService } from 'src/users/users.service';
import { CreateRentalDto } from './dto/CreateRental.dto';
import { Rental, RentalStatus } from './entities/rental.entity';
import { ToolsService } from 'src/tools/tools.service';
import { existsOr404 } from 'src/utils/types';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { RentalQueryParams } from './interfaces/RentalQueryParams.interface';
import { UpdateRentalDto } from './dto/UpdateRental.dto';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
    private usersService: UsersService,
    private toolsService: ToolsService,
  ) {}

  async createOne(user: User, createRental: CreateRentalDto) {
    if (createRental.renter === createRental.lender) {
      throw new HttpException(
        'Renter and borrower cannot be the same user',
        400,
      );
    }

    if (![createRental.renter, createRental.lender].includes(user.id)) {
      throw new HttpException(
        'Current user is neither borrower or renter. ',
        400,
      );
    }

    if (
      createRental.expectedDelivery.getTime() >=
      createRental.expectedReturn.getTime()
    ) {
      throw new HttpException(
        'expectedDelivery cannot be later than expectedReturn',
        400,
      );
    }
    const renter = existsOr404(
      await this.usersService.findOneById(createRental.renter),
    );
    const lender = existsOr404(
      await this.usersService.findOneById(createRental.lender),
    );

    const tool = existsOr404(
      await this.toolsService.findOneOwn(lender, createRental.tool),
    );

    const rental = new Rental();
    rental.note = createRental.note;
    rental.status = 'await_confirmation';
    rental.tool = tool;
    rental.initiator = user;
    rental.lender = lender;
    rental.renter = renter;
    rental.expectedDelivery = createRental.expectedDelivery;
    rental.expectedReturn = createRental.expectedReturn;

    return this.rentalRepository.save(rental);
  }

  async findOneOwn(user: User, id: number) {
    const rental = await this.rentalRepository.findOne(
      {
        id,
      },
      {
        relations: ['lender', 'renter', 'initiator', 'tool', 'tool.photos'],
      },
    );

    if (rental?.lender.id !== user.id && rental?.renter.id !== user.id) {
      return undefined;
    }

    return rental;
  }

  async findOwn(
    user: User,
    options: RentalQueryParams & IPaginationOptions,
  ): Promise<Pagination<Rental>> {
    const queryBuilder = this.rentalRepository
      .createQueryBuilder('rental')
      .orderBy('rental.created', 'DESC')
      .leftJoinAndSelect('rental.initiator', 'initiator')
      .leftJoinAndSelect('rental.lender', 'lender')
      .leftJoinAndSelect('rental.renter', 'renter')
      .leftJoinAndSelect('rental.tool', 'tool')
      .leftJoinAndSelect('tool.photos', 'photos')
      .where(`${JSON.stringify(options.type + 'Id')} = :userId`, {
        userId: user.id,
      });

    return paginate<Rental>(queryBuilder, options);
  }

  async updateOne(user: User, id: number, update: UpdateRentalDto) {
    const rental = existsOr404(await this.findOneOwn(user, id));

    if (update.status && update.status !== rental.status) {
      if (!this.checkUpdateRentalStatus(rental, update.status)) {
        throw new HttpException(
          `Cannot change status directly from ${rental.status} to ${update.status}`,
          400,
        );
      }
    }

    const nextStatus = update.status ?? rental.status;

    if (nextStatus === 'confirmed' && user.id === rental.initiator.id) {
      throw new HttpException(
        `Initiator of the rental cannot confirm the rental. `,
        400,
      );
    }

    const isRenter = user.id === rental.renter.id;
    const isLender = user.id === rental.lender.id;

    if (update.status) {
      rental.status = update.status;
    }

    if (update.note !== undefined && update.note !== rental.note) {
      this.ensureStatus('note', nextStatus, 'await_confirmation', 'confirmed');
      rental.note = update.note;
    }

    if (
      update.expectedDelivery &&
      update.expectedDelivery.getTime() !== rental.expectedDelivery?.getTime()
    ) {
      this.ensureStatus(
        'expectedDelivery',
        nextStatus,
        'await_confirmation',
        'confirmed',
      );
      rental.expectedDelivery = update.expectedDelivery;
    }
    if (
      update.expectedReturn &&
      update.expectedReturn.getTime() !== rental.expectedReturn?.getTime()
    ) {
      this.ensureStatus(
        'expectedReturn',
        nextStatus,
        'await_confirmation',
        'confirmed',
      );
      rental.expectedReturn = update.expectedReturn;
    }
    if (
      update.actualDelivery &&
      update.actualDelivery.getTime() !== rental.actualDelivery?.getTime()
    ) {
      if (!isRenter) {
        throw new HttpException(`Only renter can change actualDelivery`, 400);
      }

      this.ensureStatus('actualDelivery', nextStatus, 'delivered');
      rental.actualDelivery = update.actualDelivery;
    }
    if (
      update.actualReturn &&
      update.actualReturn.getTime() !== rental.actualReturn?.getTime()
    ) {
      if (!isLender) {
        throw new HttpException(`Only lender can change actualReturn`, 400);
      }

      this.ensureStatus('actualReturn', nextStatus, 'returned');
      rental.actualReturn = update.actualReturn;
    }

    switch (nextStatus) {
      case 'delivered':
        if (rental.actualDelivery == null)
          throw new HttpException('actualDelivery is missing. ', 400);
        break;
      case 'returned':
        if (rental.actualReturn == null)
          throw new HttpException('actualReturn is missing. ', 400);
        break;
    }

    return await this.rentalRepository.save(rental);
  }

  ensureStatus(
    fieldName: string,
    nextStatus: RentalStatus,
    ...requiredStatuses: RentalStatus[]
  ) {
    if (!requiredStatuses.includes(nextStatus)) {
      throw new HttpException(
        `Cannot change ${fieldName} when status is ${nextStatus}. Possible states are ${requiredStatuses.join(
          ', ',
        )}`,
        400,
      );
    }
  }

  checkUpdateRentalStatus(rental: Rental, update: RentalStatus): boolean {
    switch (rental.status) {
      case 'await_confirmation':
        return ['confirmed', 'cancelled'].includes(update);
      case 'confirmed':
        return ['delivered', 'cancelled'].includes(update);
      case 'delivered':
        return ['returned'].includes(update);
      case 'cancelled':
        return false;
      default:
        return true;
    }
  }
}
