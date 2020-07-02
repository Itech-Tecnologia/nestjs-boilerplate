import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { Connection, Repository } from 'typeorm';

@Injectable()
export class DatabaseUtil {
  constructor(@InjectConnection() private readonly connection: Connection) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('Test utils only for tests');
    }
  }

  public async cleanDatabase(): Promise<void> {
    for (const entity of this.entities) {
      const repository = await this.getRepository(entity);

      await repository.clear();
    }
  }

  public async getRepository<T>(entity: string): Promise<Repository<T>> {
    return this.connection.getRepository(entity);
  }

  private get entities(): string[] {
    const entities = [];

    this.connection.entityMetadatas.forEach(entity =>
      entities.push(entity.name),
    );

    return entities;
  }
}
