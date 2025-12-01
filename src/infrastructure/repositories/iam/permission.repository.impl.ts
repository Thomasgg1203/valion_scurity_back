import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PermissionEntity } from '../../database/entities/permission.entity';
import { Permission } from 'src/core/models/permission.model';
import { PermissionRepository } from 'src/common/types/ima/permission.repository';

@Injectable()
export class PermissionRepositoryImpl implements PermissionRepository {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly repo: Repository<PermissionEntity>,
  ) {}

  private toModel(entity: PermissionEntity): Permission {
    return new Permission({
      id: entity.id,
      action: entity.action,
      subject: entity.subject,
    });
  }

  async findAll(): Promise<Permission[]> {
    const rows = await this.repo.find({
      order: { subject: 'ASC', action: 'ASC' },
    });

    return rows.map((p) => this.toModel(p));
  }

  async findManyByIds(ids: string[]): Promise<Permission[]> {
    const rows = await this.repo.find({
      where: { id: In(ids) },
    });

    return rows.map((p) => this.toModel(p));
  }
}
