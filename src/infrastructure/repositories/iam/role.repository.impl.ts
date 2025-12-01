import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, IsNull } from 'typeorm';

import { RoleEntity } from '../../database/entities/role.entity';
import { Role } from '../../../core/models/role.model';

import { FindOptions } from '../../../common/types/find-options';
import { RoleRepository } from 'src/common/types/ima/role.repository';

@Injectable()
export class RoleRepositoryImpl implements RoleRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repo: Repository<RoleEntity>,
  ) {}

  private toModel(entity: RoleEntity): Role {
    return new Role({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  private escapeILike(search: string): string {
    return search.replace(/[%_\\]/g, (char) => `\\${char}`);
  }

  async findAll(options?: FindOptions): Promise<{ data: Role[]; total: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const search = options?.search?.trim();

    const skip = (page - 1) * limit;
    const sanitized = search ? this.escapeILike(search) : null;

    const [rows, total] = await this.repo.findAndCount({
      where: {
        deletedAt: IsNull(),
        name: sanitized ? ILike(`%${sanitized}%`) : undefined,
      },
      relations: ['rolePermissions', 'rolePermissions.permission'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: rows.map((r) => this.toModel(r)),
      total,
    };
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    return role ? this.toModel(role) : null;
  }

  async create(data: Partial<Role>): Promise<Role> {
    const entity = this.repo.create({
      name: data.name,
      description: data.description,
    });
    const saved = await this.repo.save(entity);
    return this.toModel(saved);
  }

  async update(id: string, data: Partial<Role>): Promise<Role> {
    const entity = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!entity) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    Object.assign(entity, data);

    const saved = await this.repo.save(entity);
    return this.toModel(saved);
  }

  async softDelete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.repo.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return { deleted: true };
  }
}
