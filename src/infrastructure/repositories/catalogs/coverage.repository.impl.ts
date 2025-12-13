import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { CoverageRepository } from 'src/common/types/catalogs/coverage.repository';
import { FindOptions } from 'src/common/types/find-options';
import { Coverage } from 'src/core/models/coverage.model';
import { CoverageEntity } from 'src/infrastructure/database/entities/coverage.entity';
import { LineOfBusinessEntity } from 'src/infrastructure/database/entities/line-of-business.entity';
import { CoverageMapper } from 'src/infrastructure/mappers/catalogs/coverage.mapper';

@Injectable()
export class CoverageRepositoryImpl implements CoverageRepository {
  constructor(
    @InjectRepository(CoverageEntity)
    private readonly repo: Repository<CoverageEntity>,
  ) {}

  async findAll(options: FindOptions = {}): Promise<{ data: Coverage[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;
    const search = options.search?.trim();
    const lobId = options.filters?.lobId as string | undefined;

    const base: FindOptionsWhere<CoverageEntity> = {
      deletedAt: IsNull(),
      ...(lobId ? { lineOfBusiness: { id: lobId, deletedAt: IsNull() } } : {}),
    };

    const where: FindOptionsWhere<CoverageEntity>[] = search
      ? [
          { ...base, name: ILike(`%${search}%`) },
          { ...base, code: ILike(`%${search}%`) },
        ]
      : [base];

    const [entities, total] = await this.repo.findAndCount({
      where,
      relations: ['lineOfBusiness'],
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map(CoverageMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<Coverage | null> {
    const entity = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['lineOfBusiness'],
    });
    return entity ? CoverageMapper.toDomain(entity) : null;
  }

  async create(data: Partial<Coverage>): Promise<Coverage> {
    const entity = CoverageMapper.toEntity(data);
    const saved = await this.repo.save(entity);
    return CoverageMapper.toDomain(saved);
  }

  async update(id: string, data: Partial<Coverage>): Promise<Coverage> {
    const entity = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['lineOfBusiness'],
    });

    if (!entity) {
      throw new NotFoundException(`Coverage with id ${id} not found`);
    }

    if (data.code !== undefined) {
      entity.code = data.code;
    }

    if (data.name !== undefined) {
      entity.name = data.name;
    }

    if (data.description !== undefined) {
      entity.description = data.description;
    }

    if (data.lineOfBusinessId !== undefined) {
      entity.lineOfBusiness = { id: data.lineOfBusinessId } as LineOfBusinessEntity;
    }

    const saved = await this.repo.save(entity);
    return CoverageMapper.toDomain(saved);
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Coverage with id ${id} not found`);
    }
  }
}
