import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth';
import { QueuesModule } from './queues';
import { SharedModule } from './shared';
import { UsersModule } from './users';

@Module({
  imports: [
    TypeOrmModule.forRoot(),

    SharedModule,
    UsersModule,
    AuthModule,
    QueuesModule,
  ],
})
export class AppModule {}
