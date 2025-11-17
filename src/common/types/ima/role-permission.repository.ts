export interface RolePermissionRepository {
  clear(roleId: string): Promise<void>;
  assign(roleId: string, permissionIds: string[]): Promise<void>;
}
