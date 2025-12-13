import { Carrier } from 'src/core/models/carrier.model';
import { FindPartnersOptions } from './find-options';

export interface CarrierRepository {
  findAll(options?: FindPartnersOptions): Promise<{ data: Carrier[]; total: number }>;
  findById(id: string): Promise<Carrier | null>;
  create(data: Partial<Carrier>): Promise<Carrier>;
  update(id: string, data: Partial<Carrier>): Promise<Carrier>;
  softDelete(id: string): Promise<void>;
}
