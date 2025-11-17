import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const query = this.repo.createQueryBuilder('state');

    if (options.search) {
      query.andWhere('LOWER(state.name) LIKE LOWER(:search)', {
        search: `%${options.search}%`,
      });
    }

    if (options.page !== undefined) query.skip(options.page);
    if (options.limit !== undefined) query.take(options.limit);

    const [entities, total] = await query.getManyAndCount();

    return {
      data: entities.map(StateMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<State | null> {
    const entity = await this.repo.findOne({ where: { id } });
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
