import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { MgaCarrier } from '../../partners/entities/mga-carrier.entity';

@Entity({ name: 'exclusion' })
export class Exclusion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MgaCarrier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mga_carrier_id' })
  mgaCarrier: MgaCarrier;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
