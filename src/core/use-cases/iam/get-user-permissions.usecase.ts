import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/repositories/tokens';
import type { UserRepository } from 'src/infrastructure/repositories/user.repository';

@Injectable()
export class GetUserPermissionsUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.users.findUserWithPermissions(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      role: user.roleName,
      permissions: user.permissions,
    };
  }
}
