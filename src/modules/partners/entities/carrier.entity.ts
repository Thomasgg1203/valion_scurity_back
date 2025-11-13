import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MgaCarrier } from './mga-carrier.entity';

@Entity({ name: 'carrier' })
export class Carrier {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 150, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @OneToMany(() => MgaCarrier, (mc) => mc.carrier)
  mgaCarriers: MgaCarrier[];
}
