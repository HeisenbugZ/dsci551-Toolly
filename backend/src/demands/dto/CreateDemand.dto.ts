import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  MaxLength,
  Validate,
} from 'class-validator';
import { CategoryExists } from 'src/categories/validators/CategoryExists';

export class CreateDemandDto {
  @IsNotEmpty()
  @MaxLength(30)
  @ApiProperty()
  readonly title!: string;

  @IsNotEmpty()
  @MaxLength(1000)
  @ApiProperty()
  readonly description!: string;

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
