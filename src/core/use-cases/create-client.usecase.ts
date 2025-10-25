import { Client } from '../domain/client.entity';
import { ClientRepository } from '../domain/client.repository';
export class CreateClientUseCase {
  constructor(private readonly repo: ClientRepository) {}

  async execute(data: Client) {
    if (!data.name) {
      throw new Error('El nombre del cliente es obligatorio');
    }

    return this.repo.create(data);
  }
}
