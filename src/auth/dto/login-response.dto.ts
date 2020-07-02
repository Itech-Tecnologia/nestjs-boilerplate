import { Exclude, Expose, Type } from 'class-transformer';

import { UserDto } from '../../users';

@Exclude()
export class LoginResponseDto {
  @Expose()
  token: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
