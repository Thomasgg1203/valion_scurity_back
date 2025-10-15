import { ClientsService } from '../clients.service';
import { ClientRepositoryImpl } from 'src/infrastructure/repositories/client.repository.impl';
import { GetAllClientsUseCase } from '../../../core/use-cases/get-all-clients.use-case';

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(() => {
    // Inicializamos el servicio antes de cada test
    service = new ClientsService();
  });

  it('should be defined', () => {
    // Test básico para verificar que el servicio se crea correctamente
    expect(service).toBeDefined();
  });

  it('should return all clients', async () => {
    // Llamamos al método getAllClients
    const clients = await service.getAllClients();

    // Esperamos que devuelva un array
    expect(Array.isArray(clients)).toBe(true);

    // Esperamos que tenga los clientes definidos en el repositorio
    expect(clients.length).toBeGreaterThan(0);
    expect(clients[0]).toHaveProperty('id');
    expect(clients[0]).toHaveProperty('name');
  });

  it('should use the use case internally', async () => {
    // Mock de GetAllClientsUseCase
    const mockExecute = jest
      .fn()
      .mockResolvedValue([{ id: 1, name: 'Mock Client' }]);

    // Reemplazamos el método execute del use case
    (service as any).clientRepo = {
      findAll: mockExecute,
    };

    const clients = await service.getAllClients();

    // Verificamos que el use case fue llamado
    expect(mockExecute).toHaveBeenCalled();
    expect(clients[0].name).toBe('Mock Client');
  });
});
