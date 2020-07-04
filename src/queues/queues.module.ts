import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Queue } from 'bull';
import { setQueues } from 'bull-board';

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
          password: configService.get('REDIS_PASSWORD'),
          db: Number(configService.get('REDIS_DB')),
          keyPrefix: configService.get('QUEUES_PREFIX'),
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
