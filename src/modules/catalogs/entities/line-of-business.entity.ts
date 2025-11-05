import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Coverage } from './coverage.entity';

@Entity({ name: 'line_of_business' })
export class LineOfBusiness {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 150 })
  name: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  // Relación con coverage
  @OneToMany(() => Coverage, (coverage) => coverage.lob)
  coverages: Coverage[];
}
