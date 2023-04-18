import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
  MaxLength,
} from 'class-validator';
import { UserAlreadyExists } from 'src/users/validators/UserExists';

export class RegisterDto {
  @IsNotEmpty()
  @MaxLength(30)
  readonly name!: string;

  @IsEmail()
  @MaxLength(30)
  @Validate(UserAlreadyExists)
  readonly email!: string;

  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(8)
  readonly password!: string;

  @IsNotEmpty()
  @MaxLength(10)
  readonly zipcode!: string;

  @MaxLength(200)
  @IsNotEmpty()
  readonly address!: string;
}
