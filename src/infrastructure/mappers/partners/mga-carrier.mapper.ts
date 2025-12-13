import { MgaCarrier } from 'src/core/models/mga-carrier.model';
import { MgaCarrierEntity } from 'src/infrastructure/database/entities/mga-carrier.entity';
import { CarrierEntity } from 'src/infrastructure/database/entities/carrier.entity';
import { MgaEntity } from 'src/infrastructure/database/entities/mga.entity';

export class MgaCarrierMapper {
  static toDomain(entity: MgaCarrierEntity): MgaCarrier {
    const mgaId =
      entity.mga?.id ??
      ('mga_id' in entity && typeof (entity as { mga_id?: string }).mga_id === 'string'
        ? (entity as { mga_id: string }).mga_id
        : undefined);
    const carrierId =
      entity.carrier?.id ??
      ('carrier_id' in entity && typeof (entity as { carrier_id?: string }).carrier_id === 'string'
        ? (entity as { carrier_id: string }).carrier_id
        : undefined);

    if (!mgaId || !carrierId) {
      throw new Error('MgaCarrierEntity missing relation identifiers');
    }

    return {
      id: entity.id,
      mgaId,
      carrierId,
      concatName: entity.concat_name,
      isActive: entity.is_active,
      appetiteNotes: entity.appetite_notes ?? undefined,
      createdBy: entity.createdBy ?? undefined,
      updatedBy: entity.updatedBy ?? undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntity(domain: Partial<MgaCarrier>): MgaCarrierEntity {
    const entity = new MgaCarrierEntity();
    if (domain.id !== undefined) entity.id = domain.id;
    if (domain.mgaId !== undefined) {
      entity.mga = { id: domain.mgaId } as MgaEntity;
    }
    if (domain.carrierId !== undefined) {
      entity.carrier = { id: domain.carrierId } as CarrierEntity;
    }
    if (domain.concatName !== undefined) entity.concat_name = domain.concatName;
    if (domain.isActive !== undefined) entity.is_active = domain.isActive;
    if (domain.appetiteNotes !== undefined) entity.appetite_notes = domain.appetiteNotes;
    if (domain.createdBy !== undefined) entity.createdBy = domain.createdBy;
    if (domain.updatedBy !== undefined) entity.updatedBy = domain.updatedBy;
    return entity;
  }
}
