import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { LineOfBusiness } from './line-of-business.entity';

@Entity({ name: 'coverage' })
export class Coverage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LineOfBusiness, (lob) => lob.coverages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lob_id' })
  lob: LineOfBusiness;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
