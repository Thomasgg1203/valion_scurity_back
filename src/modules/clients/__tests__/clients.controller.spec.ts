import { ClientsController } from '../clients.controller';
import { ClientsService } from '../clients.service';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  beforeEach(() => {
    // Creamos un mock del servicio
    service = new ClientsService();
    controller = new ClientsController(service);
  });

  it('should be defined', () => {
    // Verifica que el controlador se inicializa correctamente
    expect(controller).toBeDefined();
  });

  it('should return all clients', async () => {
    // Llamamos al endpoint findAll
    const clients = await controller.findAll();

    // Debe devolver un array con clientes
    expect(Array.isArray(clients)).toBe(true);
    expect(clients[0]).toHaveProperty('id');
    expect(clients[0]).toHaveProperty('name');
  });

  it('should call the service method', async () => {
    // Mock del método del servicio
    const mockGetAllClients = jest
      .spyOn(service, 'getAllClients')
      .mockResolvedValue([{ id: 99, name: 'Test Client' }]);

    const clients = await controller.findAll();

    // Verifica que el servicio fue llamado
    expect(mockGetAllClients).toHaveBeenCalled();
    expect(clients[0].id).toBe(99);
  });
});
