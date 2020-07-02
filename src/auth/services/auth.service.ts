import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcryptjs';
import { plainToClass } from 'class-transformer';

import { UsersService, UserDto, CreateUserDto, User } from '../../users';
import { LoginResponseDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (user && (await compare(password, user.password))) {
      return plainToClass(UserDto, user);
    }

    return null;
  }

  async login(user: User): Promise<LoginResponseDto> {
    const token = await this.jwtService.signAsync({ sub: user.id });

    return plainToClass(LoginResponseDto, { token, user });
  }

  async register({
    email,
    firstname,
    lastname,
    password,
    birthdate,
  }: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create({
      email,
      firstname,
      lastname,
      password,
      birthdate,
    });

    return user;
  }
}
