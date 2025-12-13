import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { CommodityRepository } from 'src/common/types/catalogs/commodity.repository';
import { FindOptions } from 'src/common/types/find-options';
import { Commodity } from 'src/core/models/commodity.model';
import { CommodityEntity } from 'src/infrastructure/database/entities/commodity.entity';
import { CommodityMapper } from 'src/infrastructure/mappers/catalogs/commodity.mapper';
import { handleUniqueConstraint } from 'src/common/utils/unique-constraint.util';

@Injectable()
export class CommodityRepositoryImpl implements CommodityRepository {
  constructor(
    @InjectRepository(CommodityEntity)
    private readonly repo: Repository<CommodityEntity>,
  ) {}

  async findAll(options: FindOptions = {}): Promise<{ data: Commodity[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;
    const search = options.search?.trim();

    const where: FindOptionsWhere<CommodityEntity>[] = [
      { deletedAt: IsNull(), ...(search ? { name: ILike(`%${search}%`) } : {}) },
    ];

    const [entities, total] = await this.repo.findAndCount({
      where,
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map(CommodityMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<Commodity | null> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? CommodityMapper.toDomain(entity) : null;
  }

  async create(data: Partial<Commodity>): Promise<Commodity> {
    try {
      const entity = CommodityMapper.toEntity(data);
      const saved = await this.repo.save(entity);
      return CommodityMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'Commodity name already exists');
      throw error;
    }
  }

  async update(id: string, data: Partial<Commodity>): Promise<Commodity> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });

    if (!entity) {
      throw new NotFoundException(`Commodity with id ${id} not found`);
    }

    if (data.name !== undefined) {
      entity.name = data.name;
    }

    if (data.description !== undefined) {
      entity.description = data.description;
    }

    try {
      const saved = await this.repo.save(entity);
      return CommodityMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'Commodity name already exists');
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Commodity with id ${id} not found`);
    }
  }
}
