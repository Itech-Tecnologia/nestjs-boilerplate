import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { plainToClass } from 'class-transformer';

import { UserDto, CreateUserDto, User } from '~/users';

import { User as CurrentUser } from '../decorators';
import { LoginResponseDto } from '../dto';
import { AuthService } from '../services';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: User): Promise<LoginResponseDto> {
    const loginResponse = await this.authService.login(user);

    return loginResponse;
  }

  @Post('register')
  async register(@Body() createUser: CreateUserDto): Promise<UserDto> {
    const user = await this.authService.register(createUser);

    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@CurrentUser() user: User): Promise<UserDto> {
    return plainToClass(UserDto, user);
  }
}
