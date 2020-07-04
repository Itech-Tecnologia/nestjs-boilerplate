import { INestApplication, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import * as request from 'supertest';
import { Repository } from 'typeorm';

import { AuthService } from '~/auth/services/auth.service';
import factories from '~/database/factories';
import { User } from '~/users/entities/user.entity';

import { AppModule } from './../src/app.module';
import { DatabaseUtil } from './utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let databaseUtil: DatabaseUtil;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseUtil],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    databaseUtil = app.get<DatabaseUtil>(DatabaseUtil);
    usersRepository = app.get(getRepositoryToken(User));
  });

  afterEach(async () => {
    await databaseUtil.cleanDatabase();
    await app.close();
  });

  it(`/POST /auth/register`, async () => {
    const createUser = factories.user.build();

    return request
      .agent(app.getHttpServer())
      .post('/auth/register')
      .send(createUser)
      .expect(HttpStatus.CREATED)
      .expect(({ body }) => {
        expect(body.id).toBeDefined();
        expect(body.password).toBeUndefined();
        expect(body.email).toEqual(createUser.email);
        expect(body.firstname).toEqual(createUser.firstname);
        expect(body.lastname).toEqual(createUser.lastname);
      });
  });

  it(`/POST /auth/login`, async () => {
    const user = usersRepository.create(
      factories.user.build({ password: 'password' }),
    );

    await usersRepository.save(user);

    return request
      .agent(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: 'password' })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.password).toBeUndefined();

        expect(body.user).toEqual(
          expect.objectContaining({
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
          }),
        );
      });
  });

  it(`/GET /auth/me`, async () => {
    const user = usersRepository.create(factories.user.build());

    await usersRepository.save(user);

    const authService: AuthService = app.get(AuthService);
    const { token } = await authService.getTokenByUser(user);

    return request
      .agent(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.password).toBeUndefined();

        expect(body).toEqual(
          expect.objectContaining({
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
          }),
        );
      });
  });
});
