import { State } from '../../../core/domain/catalogs/state.model';
import { StateEntity } from '../../database/entities/state.entity';

export class StateMapper {
  static toDomain(entity: StateEntity): State {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt ?? undefined,
      deletedAt: entity.deletedAt ?? undefined,
    };
  }

  static toEntity(domain: Partial<State>): StateEntity {
    const entity = new StateEntity();

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
