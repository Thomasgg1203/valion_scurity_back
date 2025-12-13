import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { LimitUnitRepository } from 'src/common/types/catalogs/limit-unit.repository';
import { FindOptions } from 'src/common/types/find-options';
import { LimitUnit } from 'src/core/models/limit-unit.model';
import { LimitUnitEntity } from 'src/infrastructure/database/entities/limit-unit.entity';
import { LimitUnitMapper } from 'src/infrastructure/mappers/catalogs/limit-unit.mapper';
import { handleUniqueConstraint } from 'src/common/utils/unique-constraint.util';

@Injectable()
export class LimitUnitRepositoryImpl implements LimitUnitRepository {
  constructor(
    @InjectRepository(LimitUnitEntity)
    private readonly repo: Repository<LimitUnitEntity>,
  ) {}

  async findAll(options: FindOptions = {}): Promise<{ data: LimitUnit[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;
    const search = options.search?.trim();

    const where: FindOptionsWhere<LimitUnitEntity>[] = [
      { deletedAt: IsNull(), ...(search ? { name: ILike(`%${search}%`) } : {}) },
    ];

    if (search) {
      where.push({ deletedAt: IsNull(), code: ILike(`%${search}%`) });
    }

    const [entities, total] = await this.repo.findAndCount({
      where,
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map(LimitUnitMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<LimitUnit | null> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? LimitUnitMapper.toDomain(entity) : null;
  }

  async create(data: Partial<LimitUnit>): Promise<LimitUnit> {
    try {
      const entity = LimitUnitMapper.toEntity(data);
      const saved = await this.repo.save(entity);
      return LimitUnitMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'Limit unit code already exists');
      throw error;
    }
  }

  async update(id: string, data: Partial<LimitUnit>): Promise<LimitUnit> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });

    if (!entity) {
      throw new NotFoundException(`Limit unit with id ${id} not found`);
    }

    if (data.code !== undefined) {
      entity.code = data.code;
    }

    if (data.name !== undefined) {
      entity.name = data.name;
    }

    try {
      const saved = await this.repo.save(entity);
      return LimitUnitMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'Limit unit code already exists');
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Limit unit with id ${id} not found`);
    }
  }
}
