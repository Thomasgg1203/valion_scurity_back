import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { GuidelineCategory } from './guideline_category.entity';

@Entity({ name: 'guideline_field' })
export class GuidelineField {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GuidelineCategory, (cat) => cat.fields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: GuidelineCategory;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  type: string;

  @Column({ type: 'text', nullable: true })
  possible_values?: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
