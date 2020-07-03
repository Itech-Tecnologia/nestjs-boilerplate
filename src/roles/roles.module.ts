import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entities';
import { RolesService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesService],
})
export class RolesModule {}
