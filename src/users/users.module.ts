import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueuesModule } from '~/queues/queues.module';
import { RolesModule } from '~/roles/roles.module';

import { User } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    QueuesModule,
    RolesModule,
  ],
  providers: [UserSubscriber, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
