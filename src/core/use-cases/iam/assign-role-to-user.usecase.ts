import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ROLE_REPOSITORY, USER_REPOSITORY } from 'src/core/repositories/tokens';
import type { UserRepository } from 'src/infrastructure/repositories/user.repository';
import type { RoleRepository } from 'src/common/types/ima/role.repository';

@Injectable()
export class AssignRoleToUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,

    @Inject(ROLE_REPOSITORY)
    private readonly roles: RoleRepository,
  ) {}

  async execute(userId: string, roleId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roles.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');

    await this.users.assignRole(userId, roleId);

    return { message: 'Role assigned successfully' };
  }
}
