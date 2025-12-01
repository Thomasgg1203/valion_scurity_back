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
import { StateEntity } from './state.entity';
import { MgaCarrierEntity } from './mga-carrier.entity';
import { GuidelineFieldEntity } from './guideline-field.entity';

@Entity({ name: 'state_rule' })
export class StateRuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MgaCarrierEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mga_carrier_id' })
  mgaCarrier: MgaCarrierEntity;

  @ManyToOne(() => StateEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'state_id' })
  state: StateEntity;

  @ManyToOne(() => GuidelineFieldEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'field_id' })
  field: GuidelineFieldEntity;

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

  @Column({ name: 'created_by', length: 100, nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', length: 100, nullable: true })
  updatedBy?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
