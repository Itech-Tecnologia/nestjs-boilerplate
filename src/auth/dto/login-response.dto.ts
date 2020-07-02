import { ApiResponseProperty } from '@nestjs/swagger';

import { Exclude, Expose, Type } from 'class-transformer';

import { UserDto } from '~/users';

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
