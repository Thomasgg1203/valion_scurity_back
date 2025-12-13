import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { CarrierRepository } from 'src/common/types/partners/carrier.repository';
import { FindPartnersOptions } from 'src/common/types/partners/find-options';
import { Carrier } from 'src/core/models/carrier.model';
import { CarrierEntity } from 'src/infrastructure/database/entities/carrier.entity';
import { CarrierMapper } from 'src/infrastructure/mappers/partners/carrier.mapper';
import { handleUniqueConstraint } from 'src/common/utils/unique-constraint.util';

@Injectable()
export class CarrierRepositoryImpl implements CarrierRepository {
  constructor(
    @InjectRepository(CarrierEntity)
    private readonly repo: Repository<CarrierEntity>,
  ) {}

  async findAll(options: FindPartnersOptions = {}): Promise<{ data: Carrier[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;
    const search = options.search?.trim();

    const where: FindOptionsWhere<CarrierEntity>[] = [
      { deletedAt: IsNull(), ...(search ? { name: ILike(`%${search}%`) } : {}) },
    ];

    const [entities, total] = await this.repo.findAndCount({
      where,
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map(CarrierMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<Carrier | null> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    return entity ? CarrierMapper.toDomain(entity) : null;
  }

  async create(data: Partial<Carrier>): Promise<Carrier> {
    try {
      const entity = CarrierMapper.toEntity(data);
      const saved = await this.repo.save(entity);
      return CarrierMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'Carrier name already exists');
      throw error;
    }
  }

  async update(id: string, data: Partial<Carrier>): Promise<Carrier> {
    const entity = await this.repo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!entity) {
      throw new NotFoundException(`Carrier with id ${id} not found`);
    }

    if (data.name !== undefined) entity.name = data.name;
    if (data.notes !== undefined) entity.notes = data.notes;

    try {
      const saved = await this.repo.save(entity);
      return CarrierMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'Carrier name already exists');
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Carrier with id ${id} not found`);
    }
  }
}
