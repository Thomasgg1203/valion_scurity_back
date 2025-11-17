import { Inject, Injectable } from '@nestjs/common';
import { PERMISSION_REPOSITORY } from 'src/core/repositories/tokens';
import type { PermissionRepository } from 'src/common/types/ima/permission.repository';

@Injectable()
export class ListPermissionsUseCase {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissions: PermissionRepository,
  ) {}

  execute() {
    return this.permissions.findAll();
  }
}
