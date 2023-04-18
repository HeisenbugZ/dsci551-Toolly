import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { RequestUser } from 'src/auth/decorators/RequestUser.decorator';
import { LoggedInGuard } from 'src/auth/guards/LoggedIn.guard';
import { User } from 'src/users/entities/user.entity';
import { ApiPaginatedResponse, existsOr404 } from 'src/utils/types';
import { DemandsService } from './demands.service';
import { CreateDemandDto } from './dto/CreateDemand.dto';
import { DemandPaginatedQuery } from './dto/DemandsPaginatedQuery.dto';
import { Demand } from './entities/demand.entity';

@Controller('demands')
export class DemandsController {
  constructor(private demandsService: DemandsService) {}

  @UseGuards(LoggedInGuard)
  @Post()
  async post(
    @RequestUser() user: User,
    @Body() tool: CreateDemandDto,
  ): Promise<Demand> {
    return await this.demandsService.createOne(user, tool);
  }

  @Get()
  @ApiPaginatedResponse(Demand)
  async getAll(@Query() options: DemandPaginatedQuery) {
    return await this.demandsService.findAll(options);
  }

  @Get(':id')
  @ApiOkResponse({
    type: () => Demand,
  })
  async getId(@Param('id', ParseIntPipe) id: number) {
    return existsOr404(await this.demandsService.findOne(id));
  }
}
