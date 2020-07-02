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
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { plainToClass } from 'class-transformer';

import { UserDto, CreateUserDto, User, UsersService } from '~/users';

import { User as CurrentUser } from '../decorators';
import { LoginResponseDto, LoginRequestDto } from '../dto';
import { AuthService } from '../services';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOkResponse({ description: 'Successful login', type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBody({ type: LoginRequestDto })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: User): Promise<LoginResponseDto> {
    const loginResponse = await this.authService.getTokenByUser(user);

    return loginResponse;
  }

  @ApiCreatedResponse({ description: 'Successful registration', type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post('register')
  async register(@Body() createUser: CreateUserDto): Promise<UserDto> {
    const user = await this.usersService.create(createUser);

    return user;
  }

  @ApiOkResponse({ description: 'Successful Response', type: UserDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async me(@CurrentUser() user: User): Promise<UserDto> {
    return plainToClass(UserDto, user);
  }
}
