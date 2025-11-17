import { State } from './state.model';
import { FindOptions } from '../common/find-options';

export interface StateRepository {
  findAll(options?: FindOptions): Promise<{ data: State[]; total: number }>;
  findById(id: string): Promise<State | null>;
  create(data: Partial<State>): Promise<State>;
  softDelete(id: string): Promise<void>;
}
