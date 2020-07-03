import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';

import * as Joi from '@hapi/joi';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { resolve } from 'path';

import { StorageProvider } from './providers';

@Global()
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

        DB_CONNECTION: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.number(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),

        SMTP_HOST: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),

        REDIS_PASSWORD: Joi.string(),
        REDIS_DB: Joi.number().default(0),
        QUEUES_PREFIX: Joi.string().default('nestjs'),

        MULTER_DISK: Joi.string().valid('local', 's3').default('local'),
        MULTER_LIMIT_SILE_SIZE: Joi.number().default(20),
        S3_KEY: Joi.string().when('MULTER_DISK', {
          is: 's3',
          then: Joi.required(),
        }),
        S3_SECRET: Joi.string().when('MULTER_DISK', {
          is: 's3',
          then: Joi.required(),
        }),
        S3_BUCKET: Joi.string().when('MULTER_DISK', {
          is: 's3',
          then: Joi.required(),
        }),
        S3_REGION: Joi.string().when('MULTER_DISK', {
          is: 's3',
          then: Joi.required(),
        }),
        S3_ACL: Joi.string().when('MULTER_DISK', {
          is: 's3',
          then: Joi.required(),
        }),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASSWORD'),
          },
        },
        defaults: {
          from: '"NestJS Team" <example@nest.com>',
        },
        template: {
          dir: resolve(process.env.PWD, 'templates', 'emails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: resolve(process.env.PWD, 'templates', 'emails', 'partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
    }),

    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService, StorageProvider],
      useFactory: (
        configService: ConfigService,
        storageProvider: StorageProvider,
      ): MulterModuleOptions => {
        const s3Storage = storageProvider.s3Storage;
        const localStorage = storageProvider.localStorage;

        const storage = s3Storage || localStorage;

        const limitFileSize = Number(
          configService.get('MULTER_LIMIT_SILE_SIZE='),
        );

        return {
          storage,
          limits: {
            fileSize: limitFileSize * 1024 * 1024,
          },
          fileFilter: (req, file, callback) => {
            const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

            if (allowedMimes.includes(file.mimetype)) callback(null, true);
            else callback(new Error('Invalid file type'), false);
          },
        };
      },
    }),
  ],
  providers: [StorageProvider],
  exports: [StorageProvider, MulterModule],
})
export class SharedModule {}
