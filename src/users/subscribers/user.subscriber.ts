import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/typeorm';

import { ISendMailOptions } from '@nestjs-modules/mailer';
import { hash } from 'bcryptjs';
import { Queue } from 'bull';
import {
  EntitySubscriberInterface,
  InsertEvent,
  Connection,
  UpdateEvent,
} from 'typeorm';

import { QueuesList } from '~/queues';

import { User } from '../entities';

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    @InjectConnection() connection: Connection,
    private readonly configService: ConfigService,
    @InjectQueue(QueuesList.SEND_MAIL)
    private readonly sendMailQueue: Queue<ISendMailOptions>,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): Function {
    return User;
  }

  async beforeInsert({ entity: user }: InsertEvent<User>): Promise<void> {
    await this.hashPassword(user);

    await this.sendMailQueue.add({
      to: `${user.fullname} <${user.email}>`,
      subject: 'Welcome to NestJS',
      template: 'welcome',
      context: { user },
    });
  }

  async beforeUpdate({
    databaseEntity,
    entity: user,
  }: UpdateEvent<User>): Promise<void> {
    if (user.password !== databaseEntity.password)
      await this.hashPassword(user);
  }

  private async hashPassword(user: User) {
    const saltRounds = Number(this.configService.get('SALT_HASH_PASSWORD'));

    const hashPassword = await hash(user.password, saltRounds);

    user.password = hashPassword;
  }
}
