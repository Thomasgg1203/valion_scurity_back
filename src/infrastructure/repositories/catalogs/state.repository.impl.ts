import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { StateRepository } from '../../../common/types/catalogs/state.repository';
import { State } from '../../../core/models/state.model';
import { StateEntity } from '../../database/entities/state.entity';
import { StateMapper } from '../../mappers/catalogs/state.mapper';
import { FindOptions } from 'src/common/types/find-options';

export class StateRepositoryImpl implements StateRepository {
  constructor(
    @InjectRepository(StateEntity)
    private repo: Repository<StateEntity>,
  ) {}

  async findAll(options: FindOptions = {}): Promise<{ data: State[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;

    const where: FindOptionsWhere<State> = {
      deletedAt: IsNull(),
    };

    if (options.search?.trim()) {
      where.name = ILike(`%${options.search.trim()}%`);
    }

    const [entities, total] = await this.repo.findAndCount({
      where,
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
    const entity = StateMapper.toEntity(data);
    const saved = await this.repo.save(entity);
    return StateMapper.toDomain(saved);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete(id);
  }
}
