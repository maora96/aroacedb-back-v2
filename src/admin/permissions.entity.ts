import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: Boolean, default: false })
  available: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  constructor(
    name: string,
    available: boolean,
    id?: string,
    createdAt?: Date | null,
  ) {
    this.id = id ?? uuid();
    this.name = name;
    this.available = available;
    this.createdAt = createdAt ?? new Date();
  }

  changeStatus(status: boolean) {
    this.available = status;
  }
}
