import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';
import { CommodityEntity } from './commodity.entity';
import { MgaCarrierEntity } from './mga-carrier.entity';

@Entity({ name: 'appetite_commodity' })
@Index(['mgaCarrier', 'commodity'], { unique: true })
export class AppetiteCommodityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MgaCarrierEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mga_carrier_id' })
  mgaCarrier: MgaCarrierEntity;

  @ManyToOne(() => CommodityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commodity_id' })
  commodity: CommodityEntity;

  @Column({ default: false })
  accepted: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ length: 20, nullable: true })
  status?: string;

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
