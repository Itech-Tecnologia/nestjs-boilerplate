import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as Joi from '@hapi/joi';

import { AuthModule } from './auth';
import { UsersModule } from './users';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'staging')
          .default('development'),
        PORT: Joi.number().default(3333),
        APP_NAME: Joi.string().default('NestBoilerplate'),
        APP_KEY: Joi.string().required(),
        SALT_HASH_PASSWORD: Joi.number().default(10),
        JWT_EXPIRES: Joi.string().required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),

    TypeOrmModule.forRoot(),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
