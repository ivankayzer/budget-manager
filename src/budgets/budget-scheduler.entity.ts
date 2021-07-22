import { Category } from '../categories/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';

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

  @ManyToMany((type) => Category)
  @JoinTable()
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;
}
