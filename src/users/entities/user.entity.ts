import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
