import { ClientsService } from '../clients.service';
import { ClientRepositoryImpl } from 'src/infrastructure/repositories/client.repository.impl';
import { GetAllClientsUseCase } from '../../../core/use-cases/
import { beforeEach, describe, it } from 'node:test';

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(() => {
    service = new ClientsService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all clients', async () => {
    const clients = await service.getAllClients();

    expect(Array.isArray(clients)).toBe(true);
    expect(clients.length).toBeGreaterThan(0);
    expect(clients[0]).toHaveProperty('id');
    expect(clients[0]).toHaveProperty('name');
  });

  it('should use the use case internally', async () => {
    const mockExecute = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: 'Mock Client' }]);

    (service as any).clientRepo = {
      findAll: mockExecute,
    };

    const clients = await service.getAllClients();

    expect(mockExecute).toHaveBeenCalled();
    expect(clients[0].name).toBe('Mock Client');
  });
});
