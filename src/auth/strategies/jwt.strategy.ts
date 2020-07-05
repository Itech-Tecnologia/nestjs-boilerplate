import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserDto } from '~/users/dtos/user.dto';
import { UsersService } from '~/users/services/users.service';

interface TokenPayload {
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('APP_KEY'),
    });
  }

  async validate(payload: TokenPayload): Promise<UserDto> {
    const user = await this.usersService.findByIdWithPassword(payload.sub);

    return user;
  }
}
