import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    id?: string,
    createdAt?: Date | null,
  ) {
    this.id = id ?? uuid();
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt ?? new Date();
  }
}
