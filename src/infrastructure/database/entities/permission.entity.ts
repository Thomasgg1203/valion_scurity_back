import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { RolePermissionEntity } from './role-permission.entity';

@Entity('permissions')
@Index(['action', 'subject'], { unique: true })
export class PermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string; // create | read | update | delete

  @Column()
  subject: string; // user | project | guideline | all

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => RolePermissionEntity, (rp) => rp.permission)
  rolePermissions: RolePermissionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
