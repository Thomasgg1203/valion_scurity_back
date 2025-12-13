import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { MgaRepository } from 'src/common/types/partners/mga.repository';
import { FindPartnersOptions } from 'src/common/types/partners/find-options';
import { Mga } from 'src/core/models/mga.model';
import { MgaEntity } from 'src/infrastructure/database/entities/mga.entity';
import { MgaMapper } from 'src/infrastructure/mappers/partners/mga.mapper';
import { handleUniqueConstraint } from 'src/common/utils/unique-constraint.util';

@Injectable()
export class MgaRepositoryImpl implements MgaRepository {
  constructor(
    @InjectRepository(MgaEntity)
    private readonly repo: Repository<MgaEntity>,
  ) {}

  async findAll(options: FindPartnersOptions = {}): Promise<{ data: Mga[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;
    const search = options.search?.trim();

    const where: FindOptionsWhere<MgaEntity>[] = [
      { deletedAt: IsNull(), ...(search ? { name: ILike(`%${search}%`) } : {}) },
    ];

    const [entities, total] = await this.repo.findAndCount({
      where,
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map(MgaMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<Mga | null> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? MgaMapper.toDomain(entity) : null;
  }

  async create(data: Partial<Mga>): Promise<Mga> {
    try {
      const entity = MgaMapper.toEntity(data);
      const saved = await this.repo.save(entity);
      return MgaMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'MGA name already exists');
      throw error;
    }
  }

  async update(id: string, data: Partial<Mga>): Promise<Mga> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!entity) {
      throw new NotFoundException(`MGA with id ${id} not found`);
    }

    if (data.name !== undefined) entity.name = data.name;
    if (data.site !== undefined) entity.site = data.site;
    if (data.notes !== undefined) entity.notes = data.notes;

    try {
      const saved = await this.repo.save(entity);
      return MgaMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'MGA name already exists');
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`MGA with id ${id} not found`);
    }
  }
}
