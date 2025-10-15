import { Client } from './client.entity';

/**
 * Interfaz que define las operaciones sobre clientes.
 * NOTA: La implementación real (DB, DynamoDB, etc.) se hace en Infrastructure.
 */
export interface ClientRepository {
  findAll(): Promise<Client[]>; // Obtener todos los clientes
  findById(id: number): Promise<Client | null>; // Buscar cliente por ID
  create(client: Client): Promise<Client>; // Crear un cliente nuevo
  update(client: Client): Promise<Client>; // Actualizar cliente existente
  delete(id: number): Promise<void>; // Eliminar cliente por ID
}
