import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength, Validate } from 'class-validator';
import { UserExists } from 'src/users/validators/UserExists';

export class CreateRentalDto {
  @IsString()
  @MaxLength(1000)
  @ApiProperty()
  readonly note!: string;

  @ApiProperty()
  readonly tool!: number;

  @ApiProperty()
  @Validate(UserExists)
  readonly lender!: number;

  @ApiProperty()
  @Validate(UserExists)
  readonly renter!: number;

  @ApiProperty()
  @Type(() => Date)
  readonly expectedDelivery!: Date;

  @ApiProperty()
  @Type(() => Date)
  readonly expectedReturn!: Date;
}
