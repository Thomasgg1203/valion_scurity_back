import { ClientRepository } from '../../core/domain/client.repository';
import { Client } from '../../core/domain/client.entity';

export class ClientRepositoryImpl implements ClientRepository {
  private clients: Client[] = [
    { id: 1, name: 'Cliente A', email: 'a@test.com', createdAt: new Date() },
    { id: 2, name: 'Cliente B', email: 'b@test.com', createdAt: new Date() },
  ];

  async findAll(): Promise<Client[]> {
    return this.clients;
  }

  async findById(id: number): Promise<Client | null> {
    return this.clients.find((c) => c.id === id) || null;
  }

  async create(client: Client): Promise<Client> {
    this.clients.push(client);
    return client;
  }

  async update(client: Client): Promise<Client> {
    const index = this.clients.findIndex((c) => c.id === client.id);
    if (index >= 0) this.clients[index] = client;
    return client;
  }

  async delete(id: number): Promise<void> {
    this.clients = this.clients.filter((c) => c.id !== id);
  }

  async count(): Promise<number> {
    return this.clients.length;
  }
}
