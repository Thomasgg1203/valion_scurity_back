import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'limit_unit' })
export class LimitUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ length: 50 })
  name: string;
}
