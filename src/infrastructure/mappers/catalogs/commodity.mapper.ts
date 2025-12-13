import { Commodity } from 'src/core/models/commodity.model';
import { CommodityEntity } from '../../database/entities/commodity.entity';

export class CommodityMapper {
  static toDomain(entity: CommodityEntity): Commodity {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntity(domain: Partial<Commodity>): CommodityEntity {
    const entity = new CommodityEntity();

    if (domain.id !== undefined) {
      entity.id = domain.id;
    }

    if (domain.name !== undefined) {
      entity.name = domain.name;
    }

    if (domain.description !== undefined) {
      entity.description = domain.description;
    }

    return entity;
  }
}
