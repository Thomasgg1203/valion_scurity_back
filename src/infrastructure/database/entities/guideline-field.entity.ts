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
import { GuidelineCategoryEntity } from './guideline_category.entity';

@Entity({ name: 'guideline_field' })
export class GuidelineFieldEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => GuidelineCategoryEntity, (cat) => cat.fields, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: GuidelineCategoryEntity;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 50 })
  type: string;

  @Column({ type: 'text', nullable: true })
  possible_values?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;
}
