import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, MaxLength } from 'class-validator';
import { RentalStatus } from '../entities/rental.entity';

export class UpdateRentalDto {
  @IsOptional()
  @MaxLength(1000)
  @ApiPropertyOptional()
  readonly note?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  readonly tool?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
  })
  readonly status?: RentalStatus;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  readonly expectedDelivery?: Date;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  readonly actualDelivery?: Date;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  readonly expectedReturn?: Date;

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  readonly actualReturn?: Date;
}
