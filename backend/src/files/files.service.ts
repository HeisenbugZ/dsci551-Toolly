import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Config } from 'config/config';

@Injectable()
export class FilesService implements OnModuleDestroy {
  s3Client: S3Client;

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    private configService: ConfigService<Config>,
  ) {
    this.s3Client = new S3Client({
      region: configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_KEY_ID')!,
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  async uploadFiles(user: User, inputFiles: Express.Multer.File[]) {
    const files = Promise.all(
      inputFiles.map(async (f) => {
        const file = new File();
        file.createdBy = user;
        file.mimeType = f.mimetype;
        file.name = f.filename || f.originalname;

        const fileHash = crypto
          .createHash('sha1')
          .update(f.buffer)
          .update(file.mimeType)
          .update(file.name)
          .digest('base64url');

        file.url = `https://${this.configService.get(
          'AWS_S3_BUCKET',
        )}.s3.amazonaws.com/${fileHash}`;

        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: this.configService.get('AWS_S3_BUCKET'),
            ACL: 'public-read',
            Body: f.buffer,
            Key: fileHash,
            ContentType: file.mimeType,
          }),
        );

        return this.filesRepository.save(file);
      }),
    );

    return files;
  }

  async findOneByUrl(url: string) {
    return this.filesRepository.findOne(url);
  }

  async findManyByUrls(urls: string[]) {
    return this.filesRepository.find({
      where: {
        url: In(urls),
      },
    });
  }

  onModuleDestroy() {
    this.s3Client.destroy();
  }
}
