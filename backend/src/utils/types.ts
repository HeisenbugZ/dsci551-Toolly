import { HttpException, HttpStatus } from '@nestjs/common';
import {
  ApiProperty,
  ApiOkResponse,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Max } from 'class-validator';

export const StringToNumber = () => Transform(({ value }) => Number(value));

export const StringToBoolean = () => Transform(({ value }) => value === 'true');

export class BasePaginatedQuery {
  @IsInt()
  @StringToNumber()
  @ApiPropertyOptional({ type: Number })
  page = 1;

  @IsInt()
  @StringToNumber()
  @Max(100)
  @ApiPropertyOptional({ type: Number })
  limit = 10;
}

export const existsOr404 = <T extends any>(
  o: T,
): Exclude<T, undefined | null> => {
  if (o == null) {
    const error = new HttpException('Object not found', HttpStatus.NOT_FOUND);
    console.error(error);
    throw error;
  }
  return o as any;
};

export const capitalizeFirstLetter = (string: string) => {
  return string[0].toUpperCase() + string.slice(1);
};

export class PaginationMeta {
  @ApiProperty()
  totalItems!: number;

  @ApiProperty()
  itemCount!: number;

  @ApiProperty()
  itemsPerPage!: number;

  @ApiProperty()
  totalPages!: number;

  @ApiProperty()
  currentPage!: number;
}

export const ApiPaginatedResponse = <C>(cls: C) => {
  class Type {
    @ApiProperty({
      type: [cls],
    })
    items!: C[];

    @ApiProperty()
    meta!: PaginationMeta;
  }

  Object.defineProperty(Type, 'name', {
    value: `Paginated${(cls as any).name}`,
  });

  return ApiOkResponse({
    type: () => Type,
  });
};
