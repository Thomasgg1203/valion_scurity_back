import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { MgaCarrier } from '../../partners/entities/mga-carrier.entity';
import { GuidelineField } from './guideline-field.entity';

@Entity({ name: 'guideline_rule' })
export class GuidelineRule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MgaCarrier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mga_carrier_id' })
  mgaCarrier: MgaCarrier;

  @ManyToOne(() => GuidelineField, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'field_id' })
  field: GuidelineField;

  @Column({ length: 20 })
  operator: string;

  @Column({ length: 255 })
  value: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ default: 1 })
  version: number;

  @Column({ default: true })
  is_current: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ name: 'created_by', length: 100, nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', length: 100, nullable: true })
  updatedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
