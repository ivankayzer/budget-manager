import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}