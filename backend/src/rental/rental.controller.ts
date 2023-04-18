import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RequestUser } from 'src/auth/decorators/RequestUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { LoggedInGuard } from 'src/auth/guards/LoggedIn.guard';
import { RentalService } from './rental.service';
import { Rental } from './entities/rental.entity';
import { CreateRentalDto } from './dto/CreateRental.dto';
import { ApiPaginatedResponse, existsOr404 } from 'src/utils/types';
import { RentalPaginatedQuery } from './dto/RentalPaginatedQuery.dto';
import { UpdateRentalDto } from './dto/UpdateRental.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@UseGuards(LoggedInGuard)
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  post(
    @RequestUser() user: User,
    @Body() createRentalDto: CreateRentalDto,
  ): Promise<Rental> {
    return this.rentalService.createOne(user, createRentalDto);
  }

  @Get(':id')
  @ApiOkResponse({
    type: () => Rental,
  })
  async get(
    @RequestUser() user: User,
    @Param('id') id: number,
  ): Promise<Rental> {
    return existsOr404(await this.rentalService.findOneOwn(user, id));
  }

  @Get('')
  @ApiPaginatedResponse(Rental)
  async getOwn(
    @RequestUser() user: User,
    @Query() query: RentalPaginatedQuery,
  ) {
    return await this.rentalService.findOwn(user, query);
  }

  @Patch(':id')
  async patch(
    @RequestUser() user: User,
    @Param('id') id: number,
    @Body() updateRentalDto: UpdateRentalDto,
  ): Promise<Rental> {
    return await this.rentalService.updateOne(user, id, updateRentalDto);
  }
}
