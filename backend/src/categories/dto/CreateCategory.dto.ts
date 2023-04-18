import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  MaxLength,
  Validate,
} from 'class-validator';
import { FileExists } from 'src/files/validators/FileExists';
import { CategoryUniqueName } from '../validators/CategoryUniqueName';

export class CreateCategoryDto {
  @IsNotEmpty()
  @Validate(CategoryUniqueName)
  @MaxLength(30)
  @ApiProperty()
  readonly name!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @Validate(FileExists, {
    each: true,
  })
  @ApiProperty({
    type: [String],
  })
  readonly photoUrls!: string[];
}
