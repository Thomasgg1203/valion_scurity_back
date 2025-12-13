import { LineOfBusiness } from 'src/core/models/line-of-business.model';
import { LineOfBusinessEntity } from '../../database/entities/line-of-business.entity';

export class LineOfBusinessMapper {
  static toDomain(entity: LineOfBusinessEntity): LineOfBusiness {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntity(domain: Partial<LineOfBusiness>): LineOfBusinessEntity {
    const entity = new LineOfBusinessEntity();

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
