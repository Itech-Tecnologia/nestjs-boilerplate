import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

import factories from '~/database/factories';
import { UsersService } from '~/users/services/users.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  const mockUsersService = {
    findByEmailWithPassword: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a user when validating their credentials', async () => {
    const mockUser = factories.user.build({
      password: await hash('password', 10),
    });

    jest
      .spyOn(usersService, 'findByEmailWithPassword')
      .mockImplementation(async () => mockUser);

    const user = await authService.validateUser(mockUser.email, 'password');

    expect(user).toBeDefined();
    expect(user).toEqual(
      expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
      }),
    );
  });

  it('should return a null user when validating their credentials', async () => {
    const mockUser = factories.user.build();

    jest
      .spyOn(usersService, 'findByEmailWithPassword')
      .mockImplementation(async () => mockUser);

    const user = await authService.validateUser(
      mockUser.email,
      Math.random().toString(36).substring(8),
    );

    expect(user).toBeNull();
  });

  it('should return a token and the user who logged in', async () => {
    const mockUser = factories.user.build();

    const token = sign({}, 'secret', {
      subject: mockUser.id,
    });

    jest.spyOn(jwtService, 'signAsync').mockImplementation(async () => token);

    const loginResponse = await authService.getTokenByUser(mockUser);

    expect(loginResponse).toBeDefined();

    expect(loginResponse.token).toEqual(token);
    expect(verify(loginResponse.token, 'secret')).toBeTruthy();

    expect(loginResponse.user).toEqual(
      expect.objectContaining({
        id: mockUser.id,
        email: mockUser.email,
        firstname: mockUser.firstname,
        lastname: mockUser.lastname,
      }),
    );
  });
});
