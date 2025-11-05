import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { GuidelineField } from './guideline-field.entity';

@Entity({ name: 'guideline_category' })
export class GuidelineCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'order_index', nullable: true })
  orderIndex?: number;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @OneToMany(() => GuidelineField, (field) => field.category)
  fields: GuidelineField[];
}
