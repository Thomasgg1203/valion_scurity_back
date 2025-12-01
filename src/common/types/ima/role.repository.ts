import { Role } from '../../../core/models/role.model';
import { FindOptions } from '../find-options';

export interface RoleRepository {
  findAll(options?: FindOptions): Promise<{ data: Role[]; total: number }>;
  findById(id: string): Promise<Role | null>;
  create(data: Partial<Role>): Promise<Role>;
  update(id: string, data: Partial<Role>): Promise<Role>;
  softDelete(id: string): Promise<{ deleted: boolean }>;
}
