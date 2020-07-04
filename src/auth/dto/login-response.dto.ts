import { ApiResponseProperty } from '@nestjs/swagger';

import { Exclude, Expose, Type } from 'class-transformer';

import { UserDto } from '~/users/dtos/user.dto';

@Exclude()
export class LoginResponseDto {
  @ApiResponseProperty()
  @Expose()
  token: string;

  @ApiResponseProperty()
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
