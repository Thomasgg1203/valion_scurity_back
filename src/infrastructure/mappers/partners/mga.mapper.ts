import { Mga } from 'src/core/models/mga.model';
import { MgaEntity } from 'src/infrastructure/database/entities/mga.entity';

export class MgaMapper {
  static toDomain(entity: MgaEntity): Mga {
    return {
      id: entity.id,
      name: entity.name,
      site: entity.site ?? undefined,
      notes: entity.notes ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntity(domain: Partial<Mga>): MgaEntity {
    const entity = new MgaEntity();
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.name !== undefined) entity.name = domain.name;
    if (domain.site !== undefined) entity.site = domain.site;
    if (domain.notes !== undefined) entity.notes = domain.notes;
    return entity;
  }
}
