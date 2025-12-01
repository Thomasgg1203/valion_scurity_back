import { Permission } from 'src/core/models/permission.model';

export interface PermissionRepository {
  findAll(): Promise<Permission[]>;
  findManyByIds(ids: string[]): Promise<Permission[]>;
}
