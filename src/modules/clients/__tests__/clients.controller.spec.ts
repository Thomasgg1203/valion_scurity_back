import { beforeEach, describe, it } from 'node:test';
import { ClientsController } from '../clients.controller';
import { ClientsService } from '../clients.service';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(() => {
    service = new ClientsService();
    controller = new ClientsController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all clients', async () => {
    const clients = await controller.findAll();

    expect(Array.isArray(clients)).toBe(true);
    expect(clients[0]).toHaveProperty('id');
    expect(clients[0]).toHaveProperty('name');
  });

  it('should call the service method', async () => {
    const mockGetAllClients = jest
      .spyOn(service, 'getAllClients')
      .mockResolvedValue([{ id: 99, name: 'Test Client' }]);

    const clients = await controller.findAll();

    expect(mockGetAllClients).toHaveBeenCalled();
    expect(clients[0].id).toBe(99);
  });
});
