import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import factories from '~/database/factories';
import { User } from '~/users';

import { UsersService } from './users.service';

describe('UsersService', () => {
  const mockRepository = () => ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  });

  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockRepository },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should be return a user by id', async () => {
    const mockUser = factories.user.build();

    jest
      .spyOn(usersRepository, 'findOne')
      .mockImplementation(async () => mockUser);

    const user = await usersService.findById(mockUser.id);

    expect(user).toBeDefined();
    expect(user.id).toEqual(mockUser.id);
    // @ts-ignore
    expect(user.password).toBeUndefined();
  });

  it('should be return a user with password by email', async () => {
    const mockUser = factories.user.build();

    jest
      .spyOn(usersRepository, 'findOne')
      .mockImplementation(async () => mockUser);

    const user = await usersService.findByEmailWithPassword(mockUser.email);

    expect(user).toEqual(mockUser);
    expect(user.password).toBeDefined();
  });

  it('should create a new user', async () => {
    const mockUser = factories.user.build();

    jest.spyOn(usersRepository, 'create').mockImplementation(() => mockUser);
    jest
      .spyOn(usersRepository, 'save')
      .mockImplementation(async () => mockUser);

    const { id, ...createUser } = mockUser;

    const user = await usersService.create(createUser);

    expect(user).toEqual(
      expect.objectContaining({
        email: mockUser.email,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
      }),
    );
    expect(user.id).toBeDefined();
    // @ts-ignore
    expect(user.password).toBeUndefined();
  });
});
