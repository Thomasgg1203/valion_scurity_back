import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { StateRepository } from '../../../common/types/catalogs/state.repository';
import { State } from '../../../core/models/state.model';
import { StateEntity } from '../../database/entities/state.entity';
import { StateMapper } from '../../mappers/catalogs/state.mapper';
import { FindOptions } from 'src/common/types/find-options';
import { handleUniqueConstraint } from 'src/common/utils/unique-constraint.util';

@Injectable()
export class StateRepositoryImpl implements StateRepository {
  constructor(
    @InjectRepository(StateEntity)
    private repo: Repository<StateEntity>,
  ) {}

  async findAll(options: FindOptions = {}): Promise<{ data: State[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;
    const search = options.search?.trim();

    const baseWhere: FindOptionsWhere<State>[] = [
      { deletedAt: IsNull(), ...(search ? { name: ILike(`%${search}%`) } : {}) },
    ];

    if (search) {
      baseWhere.push({ deletedAt: IsNull(), code: ILike(`%${search}%`) });
    }

    const [entities, total] = await this.repo.findAndCount({
      where: baseWhere,
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map(StateMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<State | null> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? StateMapper.toDomain(entity) : null;
  }

  async create(data: Partial<State>): Promise<State> {
    try {
      const entity = StateMapper.toEntity(data);
      const saved = await this.repo.save(entity);
      return StateMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'State code already exists');
      throw error;
    }
  }

  async update(id: string, data: Partial<State>): Promise<State> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!entity) {
      throw new NotFoundException(`State with id ${id} not found`);
    }

    if (data.code !== undefined) {
      entity.code = data.code;
    }

    if (data.name !== undefined) {
      entity.name = data.name;
    }

    try {
      const saved = await this.repo.save(entity);
      return StateMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'State code already exists');
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`State with id ${id} not found`);
    }
  }
}
