import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestUser } from 'src/auth/decorators/RequestUser.decorator';
import { User } from 'src/users/entities/user.entity';
import { LoggedInGuard } from 'src/auth/guards/LoggedIn.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { File } from './entities/file.entity';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FilesUploadDto } from './dto/files.dto';

@UseGuards(LoggedInGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FilesUploadDto,
  })
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'files', maxCount: 10 }], {
      limits: { fileSize: 50 * 1000000 },
    }),
  )
  post(
    @RequestUser() user: User,
    @UploadedFiles() fields?: FilesUploadDto,
  ): Promise<File[]> {
    const { files } = fields ?? {};
    if (!files)
      throw new HttpException(
        'At least upload one file. ',
        HttpStatus.BAD_REQUEST,
      );
    return this.filesService.uploadFiles(user, files);
  }
}
