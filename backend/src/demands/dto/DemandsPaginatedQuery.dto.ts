import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { CategoryExists } from 'src/categories/validators/CategoryExists';
import { UserExists } from 'src/users/validators/UserExists';
import { BasePaginatedQuery } from 'src/utils/types';

export class DemandPaginatedQuery extends BasePaginatedQuery {
  @IsOptional()
  @Validate(CategoryExists)
  @ApiPropertyOptional()
  readonly category?: number;

  @IsOptional()
  @Validate(UserExists)
  @ApiPropertyOptional()
  readonly creator?: number;
}
