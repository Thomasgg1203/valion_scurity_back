import { ClientsRepository } from '../../infrastructure/repositories/clients.repository';

/**
 * Caso de uso: Crear un cliente.
 * Contiene la lógica de negocio pura (no depende de NestJS).
 */
export class CreateClientUseCase {
  constructor(private readonly repo: ClientsRepository) {}

  async execute(data: any) {
    // Validaciones del negocio
    if (!data.name) {
      throw new Error('El nombre del cliente es obligatorio');
    }

    // Se delega la persistencia al repositorio
    return this.repo.create(data);
  }
}
