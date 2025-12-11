import { LimitUnit } from 'src/core/models/limit-unit.model';
import { LimitUnitEntity } from '../../database/entities/limit-unit.entity';

export class LimitUnitMapper {
  static toDomain(entity: LimitUnitEntity): LimitUnit {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntity(domain: Partial<LimitUnit>): LimitUnitEntity {
    const entity = new LimitUnitEntity();

    if (domain.id !== undefined) {
      entity.id = domain.id;
    }

    if (domain.code !== undefined) {
      entity.code = domain.code;
    }

    if (domain.name !== undefined) {
      entity.name = domain.name;
    }

    return entity;
  }
}
