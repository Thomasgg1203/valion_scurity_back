import { LineOfBusiness } from 'src/core/models/line-of-business.model';
import { FindOptions } from '../find-options';

export interface LineOfBusinessRepository {
  findAll(options?: FindOptions): Promise<{ data: LineOfBusiness[]; total: number }>;
  findById(id: string): Promise<LineOfBusiness | null>;
  create(data: Partial<LineOfBusiness>): Promise<LineOfBusiness>;
  update(id: string, data: Partial<LineOfBusiness>): Promise<LineOfBusiness>;
  softDelete(id: string): Promise<void>;
}
