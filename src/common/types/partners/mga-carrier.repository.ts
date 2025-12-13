import { MgaCarrier } from 'src/core/models/mga-carrier.model';
import { FindMgaCarrierOptions } from './find-options';

export interface MgaCarrierRepository {
  findAll(options?: FindMgaCarrierOptions): Promise<{ data: MgaCarrier[]; total: number }>;
  findById(id: string): Promise<MgaCarrier | null>;
  create(data: Partial<MgaCarrier>): Promise<MgaCarrier>;
  update(id: string, data: Partial<MgaCarrier>): Promise<MgaCarrier>;
  softDelete(id: string): Promise<void>;
  updateConcatForMga(mgaId: string, mgaName: string): Promise<void>;
  updateConcatForCarrier(carrierId: string, carrierName: string): Promise<void>;
}
