import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import factories from '~/database/factories';

import { RoleSlug, Role } from '../entities/role.entity';
import { RolesService } from './roles.service';

describe('RolesService', () => {
  const mockRepository = () => ({
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnThis(),
    })),
  });

  let rolesService: RolesService;
  let rolesRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Role), useFactory: mockRepository },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    rolesRepository = module.get(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  it('should return a role', async () => {
    const mockRole = factories.role.build({ slug: RoleSlug.USER });

    jest
      .spyOn(rolesRepository, 'findOne')
      .mockImplementation(async () => mockRole);

    const role = await rolesService.findBySlug(RoleSlug.USER);

    expect(role).toBeDefined();
    expect(role.slug).toEqual(RoleSlug.USER);
  });

  it('should be return the user role', async () => {
    const mockRole = factories.role.build({ slug: RoleSlug.USER });

    jest
      .spyOn(rolesRepository, 'findOne')
      .mockImplementation(async () => mockRole);

    const role = await rolesService.getUserRole();

    expect(role).toBeDefined();
    expect(role.slug).toEqual(RoleSlug.USER);
  });

  it('should be return the admin role', async () => {
    const mockRole = factories.role.build({ slug: RoleSlug.ADMIN });

    jest
      .spyOn(rolesRepository, 'findOne')
      .mockImplementation(async () => mockRole);

    const role = await rolesService.getUserRole();

    expect(role).toBeDefined();
    expect(role.slug).toEqual(RoleSlug.ADMIN);
  });

  it('should return true if the user has the role', async () => {
    const mockRole = factories.role.build({ slug: RoleSlug.ADMIN });
    const mockUser = factories.user.build();

    const createQueryBuilder: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValueOnce([mockRole]),
    };

    jest
      .spyOn(rolesRepository, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);

    const roleMatched = await rolesService.userHasRole(
      mockUser,
      RoleSlug.ADMIN,
    );

    expect(roleMatched).toBeTruthy();
    expect(createQueryBuilder.getMany).toBeCalled();
  });

  it("should return false if the user hasn't the role", async () => {
    const mockRole = factories.role.build({ slug: RoleSlug.USER });
    const mockUser = factories.user.build();

    const createQueryBuilder: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockReturnValueOnce([mockRole]),
    };

    jest
      .spyOn(rolesRepository, 'createQueryBuilder')
      .mockImplementation(() => createQueryBuilder);

    const roleMatched = await rolesService.userHasRole(
      mockUser,
      RoleSlug.ADMIN,
    );

    expect(roleMatched).toBeFalsy();
    expect(createQueryBuilder.getMany).toBeCalled();
  });
});
