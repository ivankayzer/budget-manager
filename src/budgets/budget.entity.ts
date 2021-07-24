import { BudgetScheduler } from './budget-scheduler.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  start: string;

  @Column({ type: 'date' })
  end: string;

  @Column()
  amount: number;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @ManyToOne(() => BudgetScheduler, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
    cascade: ['update'],
  })
  @JoinTable()
  scheduler: BudgetScheduler | null;

  @CreateDateColumn()
  createdAt: Date;
}
