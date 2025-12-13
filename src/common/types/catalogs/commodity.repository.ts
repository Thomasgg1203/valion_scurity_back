import { Commodity } from 'src/core/models/commodity.model';
import { FindOptions } from '../find-options';

export interface CommodityRepository {
  findAll(options?: FindOptions): Promise<{ data: Commodity[]; total: number }>;
  findById(id: string): Promise<Commodity | null>;
  create(data: Partial<Commodity>): Promise<Commodity>;
  update(id: string, data: Partial<Commodity>): Promise<Commodity>;
  softDelete(id: string): Promise<void>;
}
