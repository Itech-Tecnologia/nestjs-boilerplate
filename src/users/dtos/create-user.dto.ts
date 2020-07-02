import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEmail,
  ValidateIf,
} from 'class-validator';

@Expose()
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateIf((createUser: CreateUserDto) => !!createUser.birthdate)
  @IsDateString()
  birthdate?: Date;
}
