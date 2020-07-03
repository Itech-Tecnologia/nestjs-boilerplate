import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '~/users';

import { Role, RoleSlug } from '../entities';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  public async findBySlug(slug: string): Promise<Role | undefined> {
    return this.rolesRepository.findOne({ where: { slug } });
  }

  public async getUserRole(): Promise<Role | undefined> {
    return this.findBySlug(RoleSlug.USER);
  }

  public async getAdminRole(): Promise<Role | undefined> {
    return this.findBySlug(RoleSlug.ADMIN);
  }

  public async getRolesFromUser(user: User): Promise<Role[]> {
    if (user.roles && user.roles.length) return user.roles;

    const roles = await this.rolesRepository
      .createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .where('user.id = :id', { id: user.id })
      .getMany();

    return roles;
  }

  public async userHasRole(user: User, slug: RoleSlug): Promise<boolean> {
    const roles = await this.getRolesFromUser(user);

    return roles.map(role => role.slug).includes(slug);
  }
}
