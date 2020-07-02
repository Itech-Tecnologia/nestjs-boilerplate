import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/typeorm';

import { hash } from 'bcryptjs';
import {
  EntitySubscriberInterface,
  InsertEvent,
  Connection,
  UpdateEvent,
} from 'typeorm';

import { User } from '../entities';

@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    @InjectConnection() connection: Connection,
    private readonly configService: ConfigService,
  ) {
    connection.subscribers.push(this);
  }

  listenTo(): Function {
    return User;
  }

  async beforeInsert({ entity: user }: InsertEvent<User>): Promise<void> {
    await this.hashPassword(user);

    // TODO send mail
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
