import { SetMetadata, CustomDecorator } from '@nestjs/common';

import { RoleSlug } from '~/roles/entities/role.entity';

export const Roles = (...roles: RoleSlug[]): CustomDecorator =>
  SetMetadata('roles', roles);
