import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { RoleSlug } from '~/roles/entities/role.entity';
import { RolesService } from '~/roles/services/roles.service';
import { UsersService } from '~/users/services/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<RoleSlug[]>('roles', context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user;

    if (!user) return false;

    const check = await this.rolesService.userHasAnyRole(user, roles);

    return check;
  }
}
