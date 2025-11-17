import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { RoleRepository } from 'src/common/types/ima/role.repository';
import { FindOptions } from 'src/common/types/find-options';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ListPermissionsUseCase } from 'src/core/use-cases/iam/list-permissions.usecase';
import { AssignPermissionsUseCase } from 'src/core/use-cases/iam/assign-permissions.usecase';
import { AssignRoleToUserUseCase } from 'src/core/use-cases/iam/assign-role-to-user.usecase';
import { GetUserPermissionsUseCase } from 'src/core/use-cases/iam/get-user-permissions.usecase';
import { ROLE_REPOSITORY } from 'src/core/repositories/tokens';

@Injectable()
export class IamService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly roleRepo: RoleRepository,
    private readonly listPermissions: ListPermissionsUseCase,
    private readonly assignPermissions: AssignPermissionsUseCase,
    private readonly assignRole: AssignRoleToUserUseCase,
    private readonly getUserPerms: GetUserPermissionsUseCase,
  ) {}

  async createRole(data: CreateRoleDto) {
    return this.roleRepo.create(data);
  }

  async findAllRoles(options?: FindOptions) {
    return this.roleRepo.findAll(options);
  }

  async findOneRole(id: string) {
    const role = await this.roleRepo.findById(id);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updateRole(id: string, data: UpdateRoleDto) {
    try {
      return await this.roleRepo.update(id, data);
    } catch {
      throw new NotFoundException('Role not found');
    }
  }

  async deleteRole(id: string) {
    await this.roleRepo.softDelete(id);
  }

  findAllPermissions() {
    return this.listPermissions.execute();
  }

  assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    return this.assignPermissions.execute(roleId, permissionIds);
  }

  assignRoleToUser(userId: string, roleId: string) {
    return this.assignRole.execute(userId, roleId);
  }

  getUserPermissions(userId: string) {
    return this.getUserPerms.execute(userId);
  }
}
