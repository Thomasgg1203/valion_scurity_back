import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource, IsNull } from 'typeorm';
import { RoleEntity } from '../../infrastructure/database/entities/role.entity';
import { PermissionEntity } from '../../infrastructure/database/entities/permission.entity';
import { RolePermissionEntity } from '../../infrastructure/database/entities/role-permission.entity';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class IamService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,

    @InjectRepository(PermissionEntity)
    private readonly permRepo: Repository<PermissionEntity>,

    @InjectRepository(RolePermissionEntity)
    private readonly rolePermRepo: Repository<RolePermissionEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    private readonly dataSource: DataSource,
  ) {}

  async createRole(data: CreateRoleDto) {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  async findAllRoles() {
    return this.roleRepo.find({
      where: { deletedAt: IsNull() },
      relations: ['rolePermissions', 'rolePermissions.permission'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneRole(id: string, includeDeleted = false) {
    const role = await this.roleRepo.findOne({
      where: includeDeleted ? { id } : { id, deletedAt: IsNull() },
      relations: ['rolePermissions', 'rolePermissions.permission'],
      withDeleted: includeDeleted,
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updateRole(id: string, data: Partial<CreateRoleDto>) {
    const role = await this.findOneRole(id);
    Object.assign(role, data);
    return this.roleRepo.save(role);
  }

  async deleteRole(id: string) {
    return this.roleRepo.softDelete(id);
  }

  async findAllPermissions() {
    return this.permRepo.find({ order: { subject: 'ASC', action: 'ASC' } });
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    await this.dataSource.transaction(async (manager) => {
      const role = await manager.findOne(RoleEntity, { where: { id: roleId } });
      if (!role) throw new NotFoundException('Role not found');

      const permissions = await manager.find(PermissionEntity, {
        where: { id: In(permissionIds) },
      });
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException('One or more permission IDs not found');
      }

      await manager.delete(RolePermissionEntity, { role: { id: roleId } });
      const toSave = permissions.map((p) =>
        manager.create(RolePermissionEntity, { role, permission: p }),
      );
      await manager.save(RolePermissionEntity, toSave);
    });
  }

  async assignRoleToUser(userId: string, roleId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) throw new NotFoundException('Role not found');

    user.role = role;
    return this.userRepo.save(user);
  }

  async getUserPermissions(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
    });

    if (!user) throw new NotFoundException('User not found');

    const permissions = (user.role?.rolePermissions || []).map((rp) => ({
      action: rp.permission.action,
      subject: rp.permission.subject,
    }));

    return {
      id: user.id,
      role: user.role?.name,
      permissions,
    };
  }
}
