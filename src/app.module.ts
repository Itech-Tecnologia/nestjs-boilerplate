import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { QueuesModule } from './queues/queues.module';
import { RolesModule } from './roles/roles.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),

    SharedModule,
    UsersModule,
    AuthModule,
    QueuesModule,
    RolesModule,
  ],
})
export class AppModule {}
