import { Coverage } from 'src/core/models/coverage.model';
import { FindOptions } from '../find-options';

export interface CoverageRepository {
  findAll(options?: FindOptions): Promise<{ data: Coverage[]; total: number }>;
  findById(id: string): Promise<Coverage | null>;
  create(data: Partial<Coverage>): Promise<Coverage>;
  update(id: string, data: Partial<Coverage>): Promise<Coverage>;
  softDelete(id: string): Promise<void>;
}
