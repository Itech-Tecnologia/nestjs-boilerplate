import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { Role } from '~/roles/entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  firstname: string;

  @Column({ length: 50 })
  lastname: string;

  get fullname(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  @Column({ length: 60, unique: true })
  email: string;

  @Column({ length: 254, unique: true })
  password: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @ManyToMany(() => Role, role => role.users, { onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'role_user',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
