import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'audit_log' })
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'entity_name', length: 150 })
  entityName: string;

  @Column({ name: 'record_id', type: 'int' })
  recordId: number;

  @Column({ length: 50 })
  action: string;

  @Column({ name: 'old_value', type: 'text', nullable: true })
  oldValue?: string;

  @Column({ name: 'new_value', type: 'text', nullable: true })
  newValue?: string;

  @Column({ name: 'executed_by', length: 100 })
  executedBy: string;

  @CreateDateColumn({ name: 'executed_at' })
  executedAt: Date;
}
