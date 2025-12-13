import { Mga } from 'src/core/models/mga.model';
import { FindPartnersOptions } from './find-options';

export interface MgaRepository {
  findAll(options?: FindPartnersOptions): Promise<{ data: Mga[]; total: number }>;
  findById(id: string): Promise<Mga | null>;
  create(data: Partial<Mga>): Promise<Mga>;
  update(id: string, data: Partial<Mga>): Promise<Mga>;
  softDelete(id: string): Promise<void>;
}
