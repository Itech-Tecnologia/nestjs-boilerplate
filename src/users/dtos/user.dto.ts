import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  id: string;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  get fullname(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  @Expose()
  email: string;

  @Expose()
  birthdate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
