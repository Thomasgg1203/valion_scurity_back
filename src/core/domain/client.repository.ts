import { Client } from './client.entity';

export interface FindAllOptions {
  skip?: number;
  take?: number;
}

export interface ClientRepository {
  findAll(options?: FindAllOptions): Promise<Client[]>;
  findById(id: number): Promise<Client | null>;
  create(client: Client): Promise<Client>;
  update(client: Client): Promise<Client>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
}
