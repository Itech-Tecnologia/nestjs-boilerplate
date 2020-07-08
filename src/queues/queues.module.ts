import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Queue } from 'bull';
import { setQueues } from 'bull-board';
import { resolve } from 'path';

import { SendMailConsumer } from './consumers/send-mail.consumer';
import { QueuesList } from './queues-list';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: QueuesList.SEND_MAIL,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB'),
          keyPrefix: configService.get('QUEUES_PREFIX'),
        },
      }),
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
  ],
  providers: [SendMailConsumer],
  exports: [BullModule],
})
export class QueuesModule implements OnModuleInit {
  constructor(
    @InjectQueue(QueuesList.SEND_MAIL) private readonly sendMailQueue: Queue,
  ) {}

  onModuleInit(): void {
    setQueues([this.sendMailQueue]);
  }
}
