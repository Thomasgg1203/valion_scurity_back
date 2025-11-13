import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { MgaCarrier } from './mga-carrier.entity';

@Entity({ name: 'mga' })
export class Mga {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 150, unique: true })
  name: string;

  @Column({ length: 100, nullable: true })
  site?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @OneToMany(() => MgaCarrier, (mc) => mc.mga)
  mgaCarriers: MgaCarrier[];
}
