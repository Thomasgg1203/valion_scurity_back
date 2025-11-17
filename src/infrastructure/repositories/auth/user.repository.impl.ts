import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { User } from 'src/core/models/user.model';
import type { UserRepository } from '../user.repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOne({
      where: { email, deletedAt: IsNull() },
      relations: ['role'],
    });

    if (!user) return null;

    return new User({
      id: user.id,
      email: user.email,
      password: user.password,
      roleId: user.role?.id ?? null,
      roleName: user.role?.name ?? null,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['role'],
    });

    if (!user) return null;

    return new User({
      id: user.id,
      email: user.email,
      roleId: user.role?.id ?? null,
      roleName: user.role?.name ?? null,
    });
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await this.repo.update(userId, { role: { id: roleId } });
  }

  async findUserWithPermissions(userId: string): Promise<{
    id: string;
    email: string;
    roleId: string | null;
    roleName: string | null;
    permissions: { action: string; subject: string }[];
  } | null> {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      roleId: user.role?.id ?? null,
      roleName: user.role?.name ?? null,
      permissions:
        user.role?.rolePermissions?.map((rp) => ({
          action: rp.permission.action,
          subject: rp.permission.subject,
        })) ?? [],
    };
  }
}
