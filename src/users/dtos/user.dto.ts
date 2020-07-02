import { ApiResponseProperty } from '@nestjs/swagger';

import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UserDto {
  @ApiResponseProperty()
  @Expose()
  id: string;

  @ApiResponseProperty()
  @Expose()
  firstname: string;

  @ApiResponseProperty()
  @Expose()
  lastname: string;

  @ApiResponseProperty()
  @Expose()
  get fullname(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  @ApiResponseProperty()
  @Expose()
  email: string;

  @ApiResponseProperty()
  @Expose()
  birthdate: Date;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
