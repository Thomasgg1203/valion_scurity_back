import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, IsNull, Repository } from 'typeorm';
import { MgaCarrierRepository } from 'src/common/types/partners/mga-carrier.repository';
import { FindMgaCarrierOptions } from 'src/common/types/partners/find-options';
import { MgaCarrier } from 'src/core/models/mga-carrier.model';
import { MgaCarrierEntity } from 'src/infrastructure/database/entities/mga-carrier.entity';
import { MgaCarrierMapper } from 'src/infrastructure/mappers/partners/mga-carrier.mapper';
import { handleUniqueConstraint } from 'src/common/utils/unique-constraint.util';

@Injectable()
export class MgaCarrierRepositoryImpl implements MgaCarrierRepository {
  constructor(
    @InjectRepository(MgaCarrierEntity)
    private readonly repo: Repository<MgaCarrierEntity>,
  ) {}

  async findAll(
    options: FindMgaCarrierOptions = {},
  ): Promise<{ data: MgaCarrier[]; total: number }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;
    const search = options.search?.trim();

    const base: FindOptionsWhere<MgaCarrierEntity> = {
      deletedAt: IsNull(),
      ...(options.isActive !== undefined ? { is_active: options.isActive } : {}),
      mga: {
        deletedAt: IsNull(),
        ...(options.mgaId ? { id: options.mgaId } : {}),
      },
      carrier: {
        deletedAt: IsNull(),
        ...(options.carrierId ? { id: options.carrierId } : {}),
      },
    };

    const where: FindOptionsWhere<MgaCarrierEntity>[] = search
      ? [
          { ...base, concat_name: ILike(`%${search}%`) },
          { ...base, appetite_notes: ILike(`%${search}%`) },
        ]
      : [base];

    const [entities, total] = await this.repo.findAndCount({
      where,
      relations: ['mga', 'carrier'],
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map(MgaCarrierMapper.toDomain),
      total,
    };
  }

  async findById(id: string): Promise<MgaCarrier | null> {
    const entity = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['mga', 'carrier'],
    });
    return entity ? MgaCarrierMapper.toDomain(entity) : null;
  }

  async create(data: Partial<MgaCarrier>): Promise<MgaCarrier> {
    try {
      const entity = MgaCarrierMapper.toEntity(data);
      const saved = await this.repo.save(entity);
      return MgaCarrierMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'MGA and carrier relation already exists');
      throw error;
    }
  }

  async update(id: string, data: Partial<MgaCarrier>): Promise<MgaCarrier> {
    const entity = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['mga', 'carrier'],
    });
    if (!entity) {
      throw new NotFoundException(`MGA carrier relation with id ${id} not found`);
    }

    if (data.appetiteNotes !== undefined) entity.appetite_notes = data.appetiteNotes;
    if (data.updatedBy !== undefined) entity.updatedBy = data.updatedBy;
    if (data.isActive !== undefined) entity.is_active = data.isActive;
    if (data.concatName !== undefined) entity.concat_name = data.concatName;

    try {
      const saved = await this.repo.save(entity);
      return MgaCarrierMapper.toDomain(saved);
    } catch (error) {
      handleUniqueConstraint(error, 'MGA and carrier relation already exists');
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.repo.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`MGA carrier relation with id ${id} not found`);
    }
  }

  async updateConcatForMga(mgaId: string, mgaName: string): Promise<void> {
    const relations = await this.repo.find({
      where: { deletedAt: IsNull(), mga: { id: mgaId, deletedAt: IsNull() } },
      relations: ['carrier'],
    });

    for (const relation of relations) {
      if (!relation.carrier) continue;
      const concatName = `${mgaName} / ${relation.carrier.name}`;
      if (relation.concat_name !== concatName) {
        await this.repo.update({ id: relation.id }, { concat_name: concatName });
      }
    }
  }

  async updateConcatForCarrier(carrierId: string, carrierName: string): Promise<void> {
    const relations = await this.repo.find({
      where: { deletedAt: IsNull(), carrier: { id: carrierId, deletedAt: IsNull() } },
      relations: ['mga'],
    });

    for (const relation of relations) {
      if (!relation.mga) continue;
      const concatName = `${relation.mga.name} / ${carrierName}`;
      if (relation.concat_name !== concatName) {
        await this.repo.update({ id: relation.id }, { concat_name: concatName });
      }
    }
  }
}
