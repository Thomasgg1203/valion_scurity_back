import { LimitUnit } from 'src/core/models/limit-unit.model';
import { FindOptions } from '../find-options';

export interface LimitUnitRepository {
  findAll(options?: FindOptions): Promise<{ data: LimitUnit[]; total: number }>;
  findById(id: string): Promise<LimitUnit | null>;
  create(data: Partial<LimitUnit>): Promise<LimitUnit>;
  update(id: string, data: Partial<LimitUnit>): Promise<LimitUnit>;
  softDelete(id: string): Promise<void>;
}
