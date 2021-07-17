import { Category } from 'src/categories/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  amount: number;

  @Column({ type: 'date' })
  paidAt: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @ManyToOne(type => Category, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
    cascade: ['update'],
  })
  @JoinTable()
  category: Category | null;

  @CreateDateColumn()
  createdAt: Date;
}
