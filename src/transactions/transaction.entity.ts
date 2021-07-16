import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @CreateDateColumn()
  createdAt: Date;
}
