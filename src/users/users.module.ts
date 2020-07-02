import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities';
import { UsersService } from './services';
import { UserSubscriber } from './subscribers';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  providers: [UserSubscriber, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
