import { Injectable } from '@nestjs/common';
import { ClientRepositoryImpl } from 'src/infrastructure/repositories/client.repository.impl';
import { GetAllClientsUseCase } from 'src/core/use-cases/get-all-clients.use-case';

@Injectable()
export class ClientsService {
  private clientRepo = new ClientRepositoryImpl();

  /**
   * Get clients with optional pagination
   * @param page page number
   * @param perPage number of records per page
   */
  async getAllClients(page?: number, perPage?: number) {
    const useCase = new GetAllClientsUseCase(this.clientRepo);
    return useCase.execute(page, perPage);
  }
}
