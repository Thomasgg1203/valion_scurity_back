import { Injectable } from '@nestjs/common';
import { ClientRepositoryImpl } from 'src/infrastructure/repositories/client.repository.impl';
import { GetAllClientsUseCase } from 'src/core/use-cases/get-all-clients.use-case';

/**
 * Servicio NestJS para clientes
 *
 * Aquí llamamos a los casos de uso y podemos añadir lógica
 * específica de la aplicación si se necesita.
 */
@Injectable()
export class ClientsService {
  // Instanciamos el repositorio de infraestructura
  private clientRepo = new ClientRepositoryImpl();

  /**
   * Método para obtener todos los clientes
   */
  async getAllClients() {
    const useCase = new GetAllClientsUseCase(this.clientRepo);
    return useCase.execute();
  }
}
