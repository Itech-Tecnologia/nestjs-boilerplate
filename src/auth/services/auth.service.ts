import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcryptjs';
import { plainToClass } from 'class-transformer';

import { UsersService, UserDto, User } from '~/users';

import { LoginResponseDto } from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto | null> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) return null;

    const passwordMatched = await compare(password, user.password);

    if (passwordMatched) return plainToClass(UserDto, user);

    return null;
  }

  async getTokenByUser(user: User): Promise<LoginResponseDto> {
    const token = await this.jwtService.signAsync({ sub: user.id });

    return plainToClass(LoginResponseDto, { token, user });
  }
}
