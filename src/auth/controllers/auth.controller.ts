import {
  Controller,
  Req,
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

import { Request } from 'express';

import { UserDto, CreateUserDto } from '../../users';
import { LoginResponseDto } from '../dto';
import { AuthService } from '../services';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Req() req: Request): Promise<LoginResponseDto> {
    const loginResponse = await this.authService.login(req.user);

    return loginResponse;
  }

  @Post('signup')
  async signup(@Body() createUser: CreateUserDto): Promise<UserDto> {
    const user = await this.authService.register(createUser);

    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@Req() req: Request): Promise<UserDto> {
    const user = req.user;

    return new UserDto(user);
  }
}
