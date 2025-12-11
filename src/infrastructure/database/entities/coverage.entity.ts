import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { LineOfBusinessEntity } from './line-of-business.entity';

@Entity({ name: 'coverage' })
export class CoverageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LineOfBusinessEntity, (lob) => lob.coverages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lob_id' })
  lineOfBusiness: LineOfBusinessEntity;

  @Column({ length: 50 })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
