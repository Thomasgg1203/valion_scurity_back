import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, QueryFailedError, Repository } from 'typeorm';
import { LineOfBusinessRepository } from 'src/common/types/catalogs/line-of-business.repository';
import { FindOptions } from 'src/common/types/find-options';
import { LineOfBusiness } from 'src/core/models/line-of-business.model';
import { LineOfBusinessEntity } from 'src/infrastructure/database/entities/line-of-business.entity';
import { LineOfBusinessMapper } from 'src/infrastructure/mappers/catalogs/line-of-business.mapper';

@Injectable()
export class LineOfBusinessRepositoryImpl implements LineOfBusinessRepository {
  constructor(
    @InjectRepository(LineOfBusinessEntity)
    private readonly repo: Repository<LineOfBusinessEntity>,
  ) {}

  async findAll(options: FindOptions = {}): Promise<{ data: LineOfBusiness[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;
    const search = options.search?.trim();

    const where: FindOptionsWhere<LineOfBusinessEntity>[] = [
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
      data: entities.map(LineOfBusinessMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<LineOfBusiness | null> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? LineOfBusinessMapper.toDomain(entity) : null;
  }

  async create(data: Partial<LineOfBusiness>): Promise<LineOfBusiness> {
    try {
      const entity = LineOfBusinessMapper.toEntity(data);
      const saved = await this.repo.save(entity);
      return LineOfBusinessMapper.toDomain(saved);
    } catch (error) {
      this.handleUniqueConstraint(error, 'Line of business code already exists');
      throw error;
    }
  }

  async update(id: string, data: Partial<LineOfBusiness>): Promise<LineOfBusiness> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });

    if (!entity) {
      throw new NotFoundException(`Line of business with id ${id} not found`);
    }

    if (data.code !== undefined) {
      entity.code = data.code;
    }

    if (data.name !== undefined) {
      entity.name = data.name;
    }

    try {
      const saved = await this.repo.save(entity);
      return LineOfBusinessMapper.toDomain(saved);
    } catch (error) {
      this.handleUniqueConstraint(error, 'Line of business code already exists');
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Line of business with id ${id} not found`);
    }
  }

  private handleUniqueConstraint(error: unknown, message: string) {
    if (!(error instanceof QueryFailedError)) return;
    const driverError = (error as QueryFailedError & { driverError?: { code?: string } })
      .driverError;
    if (driverError?.code === '23505') throw new ConflictException(message);
  }
}
