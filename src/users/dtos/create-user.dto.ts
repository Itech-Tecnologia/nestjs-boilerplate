import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiProperty({ required: true })
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  lastname: string;

  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  password: string;

  @ValidateIf((createUser: CreateUserDto) => !!createUser.birthdate)
  @IsDateString()
  @ApiPropertyOptional()
  birthdate?: Date;
}
