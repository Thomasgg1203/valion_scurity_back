import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Mga } from './mga.entity';
import { Carrier } from './carrier.entity';

@Entity({ name: 'mga_carrier' })
@Index(['mga', 'carrier'], { unique: true })
export class MgaCarrier {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => Mga, (mga) => mga.mgaCarriers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mga_id' })
  mga: Mga;

  @ManyToOne(() => Carrier, (carrier) => carrier.mgaCarriers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carrier_id' })
  carrier: Carrier;

  @Column({ length: 255 })
  concat_name: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  appetite_notes?: string;

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
