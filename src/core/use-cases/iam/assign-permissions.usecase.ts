import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { PermissionRepository } from 'src/common/types/ima/permission.repository';
import type { RolePermissionRepository } from 'src/common/types/ima/role-permission.repository';
import type { RoleRepository } from 'src/common/types/ima/role.repository';
import {
  PERMISSION_REPOSITORY,
  ROLE_PERMISSION_REPOSITORY,
  ROLE_REPOSITORY,
} from 'src/core/repositories/tokens';

@Injectable()
export class AssignPermissionsUseCase {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roles: RoleRepository,

    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,

    @Inject(ROLE_PERMISSION_REPOSITORY)
    private readonly rolePermissions: RolePermissionRepository,
  ) {}

  async execute(roleId: string, permissionIds: string[]) {
    const role = await this.roles.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');

    const perms = await this.permissions.findManyByIds(permissionIds);
    if (perms.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    await this.rolePermissions.clear(roleId);
    await this.rolePermissions.assign(roleId, permissionIds);

    return { message: 'Permissions assigned successfully' };
  }
}
