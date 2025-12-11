import { State } from '../../../core/models/state.model';
import { FindOptions } from '../find-options';

export interface StateRepository {
  findAll(options?: FindOptions): Promise<{ data: State[]; total: number }>;
  findById(id: string): Promise<State | null>;
  create(data: Partial<State>): Promise<State>;
  update(id: string, data: Partial<State>): Promise<State>;
  softDelete(id: string): Promise<void>;
}
