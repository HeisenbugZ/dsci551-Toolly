import { IsOptional, MaxLength, Validate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { FileExists } from 'src/files/validators/FileExists';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(30)
  @ApiPropertyOptional()
  readonly name?: string;

  @IsOptional()
  @MaxLength(10)
  @ApiPropertyOptional()
  readonly zipcode?: string;

  @IsOptional()
  @MaxLength(200)
  @ApiPropertyOptional()
  readonly address?: string;

  @IsOptional()
  @MaxLength(200)
  @Validate(FileExists)
  @ApiPropertyOptional()
  readonly profilePhotoUrl?: string;
}
