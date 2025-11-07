import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
  ) {}

  async createRole(data: CreateRoleDto) {
    const role = this.roleRepo.create(data);
    return this.roleRepo.save(role);
  }

  async findAllRoles() {
    return this.roleRepo.find({
      where: { deleted: false },
      relations: ['rolePermissions', 'rolePermissions.permission'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOneRole(id: string, includeDeleted = false) {
    const role = await this.roleRepo.findOne({
      where: includeDeleted ? { id } : { id, deleted: false },
      relations: ['rolePermissions', 'rolePermissions.permission'],
      withDeleted: includeDeleted,
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updateRole(id: string, data: Partial<CreateRoleDto>) {
    const role = await this.findOneRole(id);
    if (role.deleted) throw new NotFoundException('Cannot update a deleted role');

    Object.assign(role, data);
    return this.roleRepo.save(role);
  }

  async deleteRole(id: string) {
    const role = await this.findOneRole(id);
    role.deleted = true;
    await this.roleRepo.softRemove(role);
    return { message: 'Role deleted logically' };
  }

  async findAllPermissions() {
    return this.permRepo.find({ order: { subject: 'ASC', action: 'ASC' } });
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]) {
    const role = await this.findOneRole(roleId);
    await this.rolePermRepo.delete({ role: { id: roleId } });

    const permissions = await this.permRepo.find({ where: { id: In(permissionIds) } });
    const toSave = permissions.map((p) => this.rolePermRepo.create({ role, permission: p }));

    await this.rolePermRepo.save(toSave);
    return this.findOneRole(roleId);
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
