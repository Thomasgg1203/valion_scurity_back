import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';

export class GetAllClientsUseCase {
  constructor(private clientRepo: ClientRepository) {}

  /**
   * Get clients with optional pagination
   * @param page page number
   * @param perPage number of records per page
   */
  async execute(page?: number, perPage?: number): Promise<{ data: Client[]; total: number }> {
    if (page != null && perPage != null) {
      const total = await this.clientRepo.count();
      const data = await this.clientRepo.findAll({
        skip: (page - 1) * perPage,
        take: perPage,
      });
      return { data, total };
    }

    // Si no se pasan parámetros, devuelve todos
    const data = await this.clientRepo.findAll();
    return { data, total: data.length };
  }
}
