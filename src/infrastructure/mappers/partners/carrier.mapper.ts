import { Carrier } from 'src/core/models/carrier.model';
import { CarrierEntity } from 'src/infrastructure/database/entities/carrier.entity';

export class CarrierMapper {
  static toDomain(entity: CarrierEntity): Carrier {
    return {
      id: entity.id,
      name: entity.name,
      notes: entity.notes ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntity(domain: Partial<Carrier>): CarrierEntity {
    const entity = new CarrierEntity();
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.name !== undefined) entity.name = domain.name;
    if (domain.notes !== undefined) entity.notes = domain.notes;
    return entity;
  }
}
