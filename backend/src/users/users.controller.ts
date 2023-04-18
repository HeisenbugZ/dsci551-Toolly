import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestUser } from 'src/auth/decorators/RequestUser.decorator';
import { User } from './entities/user.entity';
import { LoggedInGuard } from 'src/auth/guards/LoggedIn.guard';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { existsOr404 } from 'src/utils/types';
import { ApiOkResponse } from '@nestjs/swagger';

@UseGuards(LoggedInGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({
    type: User,
  })
  async getMe(@RequestUser() user: User): Promise<User> {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await this.usersService.findOneById(user.id))!;
  }

  @Patch('me')
  patchMe(
    @RequestUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateOne(user, updateUserDto);
  }

  @Get(':id')
  @ApiOkResponse({
    type: User,
  })
  async getId(@Param('id') id: number): Promise<User> {
    return existsOr404(await this.usersService.findOneById(id));
  }
}
