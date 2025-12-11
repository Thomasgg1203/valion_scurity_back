import { Coverage } from 'src/core/models/coverage.model';
import { CoverageEntity } from '../../database/entities/coverage.entity';
import { LineOfBusinessEntity } from '../../database/entities/line-of-business.entity';

export class CoverageMapper {
  static toDomain(entity: CoverageEntity): Coverage {
    const lineOfBusinessId =
      entity.lineOfBusiness?.id ??
      // safeguard when only fk is present
      ('lineOfBusinessId' in entity &&
      typeof (entity as { lineOfBusinessId?: string }).lineOfBusinessId === 'string'
        ? (entity as { lineOfBusinessId: string }).lineOfBusinessId
        : '');

    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description ?? undefined,
      lineOfBusinessId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntity(domain: Partial<Coverage>): CoverageEntity {
    const entity = new CoverageEntity();

    if (domain.id !== undefined) {
      entity.id = domain.id;
    }

    if (domain.code !== undefined) {
      entity.code = domain.code;
    }

    if (domain.name !== undefined) {
      entity.name = domain.name;
    }

    if (domain.description !== undefined) {
      entity.description = domain.description;
    }

    if (domain.lineOfBusinessId) {
      entity.lineOfBusiness = { id: domain.lineOfBusinessId } as LineOfBusinessEntity;
    }

    return entity;
  }
}
