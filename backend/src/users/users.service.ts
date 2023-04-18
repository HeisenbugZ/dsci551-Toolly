import { HttpException, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from 'src/files/files.service';
import { GeocodeService } from 'src/geocode/geocode.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private filesService: FilesService,
    private geocodeService: GeocodeService,
  ) {}

  async findOneById(id: number) {
    return this.usersRepository.findOne(id, { relations: ['profilePhoto'] });
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      email,
    });
  }

  async updateGeocode(user: User) {
    const geocodeResponse = await this.geocodeService.geocode({
      address: user.address,
      zipcode: user.zipcode,
    });

    if (geocodeResponse?.length) {
      user.latitude = geocodeResponse[0].latitude ?? 0;
      user.longitude = geocodeResponse[0].longitude ?? 0;
    } else {
      throw new HttpException('Please input a correct address!', 400);
    }
  }

  async updateOne(user: User, updateUserDto: UpdateUserDto) {
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.address) {
      user.address = updateUserDto.address;
    }

    if (updateUserDto.zipcode) {
      user.zipcode = updateUserDto.zipcode;
    }

    if (updateUserDto.zipcode || updateUserDto.address) {
      await this.updateGeocode(user);
    }

    if (updateUserDto.profilePhotoUrl) {
      user.profilePhoto = await this.filesService.findOneByUrl(
        updateUserDto.profilePhotoUrl,
      );
    }
    await this.usersRepository.save(user);
    return user;
  }
}
