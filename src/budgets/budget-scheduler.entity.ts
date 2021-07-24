import { Category } from '../categories/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { RepeatFrequency } from './interfaces/repeat-frequency';

@Entity()
export class BudgetScheduler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  start: string;

  @Column()
  amount: number;

  @Column({ default: false })
  rollover: boolean;

  @Column()
  repeat: RepeatFrequency;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;
}
