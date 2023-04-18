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
import { Tool } from './entities/tool.entity';
import { CreateToolDto } from './dto/CreateTool.dto';
import { ToolsService } from './tools.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiPaginatedResponse, existsOr404 } from 'src/utils/types';
import { UpdateToolDto } from './dto/UpdateTool.dto';
import { ToolsPaginatedQuery } from './dto/ToolsPaginatedQuery.dto';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('tools')
export class ToolsController {
  constructor(private toolsService: ToolsService) {}

  @UseGuards(LoggedInGuard)
  @Post()
  async post(
    @RequestUser() user: User,
    @Body() tool: CreateToolDto,
  ): Promise<Tool> {
    return await this.toolsService.createOne(user, tool);
  }

  // Returns user's own tools
  @UseGuards(LoggedInGuard)
  @Get('me')
  @ApiPaginatedResponse(Tool)
  async getMe(
    @RequestUser() user: User,
    @Query() query: ToolsPaginatedQuery,
  ): Promise<Pagination<Tool>> {
    return this.toolsService.findOwn(user, query);
  }

  @Get()
  @ApiPaginatedResponse(Tool)
  async get(@Query() query: ToolsPaginatedQuery): Promise<Pagination<Tool>> {
    return this.toolsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Tool,
  })
  async getId(@Param('id', ParseIntPipe) id: number): Promise<Tool> {
    return existsOr404(await this.toolsService.findOne(id));
  }

  @UseGuards(LoggedInGuard)
  @Patch(':id')
  async patchId(
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateToolDto: UpdateToolDto,
  ): Promise<Tool> {
    return existsOr404(
      await this.toolsService.updateOneOwn(user, id, updateToolDto),
    );
  }

  @UseGuards(LoggedInGuard)
  @Delete(':id')
  async deleteId(
    @RequestUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.toolsService.deleteOneOwn(user, id);
    return;
  }
}
