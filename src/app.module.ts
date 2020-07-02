import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth';
import { SharedModule } from './shared';
import { UsersModule } from './users';

@Module({
  imports: [TypeOrmModule.forRoot(), SharedModule, UsersModule, AuthModule],
})
export class AppModule {}
