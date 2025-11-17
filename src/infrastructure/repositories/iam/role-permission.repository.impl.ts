import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RolePermissionEntity } from '../../database/entities/role-permission.entity';
import { RoleEntity } from '../../database/entities/role.entity';
import { PermissionEntity } from '../../database/entities/permission.entity';
import { RolePermissionRepository } from 'src/common/types/ima/role-permission.repository';

@Injectable()
export class RolePermissionRepositoryImpl implements RolePermissionRepository {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermRepo: Repository<RolePermissionEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,

    @InjectRepository(PermissionEntity)
    private readonly permRepo: Repository<PermissionEntity>,
  ) {}

  async clear(roleId: string): Promise<void> {
    await this.rolePermRepo.delete({ role: { id: roleId } });
  }

  async assign(roleId: string, permissionIds: string[]): Promise<void> {
    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('Role not found');
    }

    const permissions = await this.permRepo.find({
      where: { id: In(permissionIds) },
    });

    if (permissions.length !== permissionIds.length) {
      throw new Error('One or more permissions not found');
    }

    const items = permissions.map((p) =>
      this.rolePermRepo.create({
        role,
        permission: p,
      }),
    );

    await this.rolePermRepo.save(items);
  }
}
