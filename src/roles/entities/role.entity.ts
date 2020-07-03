import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { User } from '~/users/entities';

export enum RoleSlug {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10, unique: true })
  slug: RoleSlug;

  @Column({ length: 10, unique: true })
  name: string;

  @Column({ length: 50, nullable: true })
  description: string;

  @ManyToMany(() => User, user => user.roles)
  users: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
