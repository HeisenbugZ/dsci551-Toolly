import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { BasePaginatedQuery } from 'src/utils/types';
import { RentalQueryParams } from '../interfaces/RentalQueryParams.interface';

export class RentalPaginatedQuery
  extends BasePaginatedQuery
  implements RentalQueryParams
{
  @IsIn(['lender', 'renter', 'initiator'])
  @ApiProperty({ type: String })
  readonly type!: RentalQueryParams['type'];
}
