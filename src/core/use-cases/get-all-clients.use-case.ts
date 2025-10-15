import { ClientRepository } from '../domain/client.repository';
import { Client } from '../domain/client.entity';

/**
 * Caso de uso: Obtener todos los clientes
 *
 * NOTA: Aquí aplicamos la lógica del negocio si fuera necesario.
 * Por ahora solo delegamos al repositorio.
 */
export class GetAllClientsUseCase {
  constructor(private clientRepo: ClientRepository) {}

  /**
   * Ejecuta el caso de uso y retorna la lista de clientes
   */
  async execute(): Promise<Client[]> {
    return this.clientRepo.findAll();
  }
}
