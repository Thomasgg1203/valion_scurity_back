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
import { MgaCarrier } from '../../partners/entities/mga-carrier.entity';
import { Commodity } from '../../catalogs/entities/commodity.entity';

@Entity({ name: 'appetite_commodity' })
@Index(['mgaCarrier', 'commodity'], { unique: true })
export class AppetiteCommodity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MgaCarrier, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mga_carrier_id' })
  mgaCarrier: MgaCarrier;

  @ManyToOne(() => Commodity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commodity_id' })
  commodity: Commodity;

  @Column({ default: false })
  accepted: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ length: 20, nullable: true })
  status?: string;

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
