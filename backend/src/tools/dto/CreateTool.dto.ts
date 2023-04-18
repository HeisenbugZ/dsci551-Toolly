import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  MaxLength,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryExists } from 'src/categories/validators/CategoryExists';
import { FileExists } from 'src/files/validators/FileExists';

export class CreateToolDto {
  @IsNotEmpty()
  @MaxLength(200)
  @ApiProperty()
  readonly name!: string;

  @IsNotEmpty()
  @MaxLength(1000)
  @ApiProperty()
  readonly introduction!: string;

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

  @IsArray()
  @ArrayMaxSize(4)
  @Validate(CategoryExists, {
    each: true,
  })
  @ApiProperty({
    type: [Number],
  })
  readonly categoryIds!: number[];
}
