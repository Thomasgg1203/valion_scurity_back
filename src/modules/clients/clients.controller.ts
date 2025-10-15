import { Controller, Get } from '@nestjs/common';
import { ClientsService } from './clients.service';

/**
 * Controlador de clientes
 *
 * Expone los endpoints HTTP de la API
 */
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  /**
   * GET /clients
   * Retorna todos los clientes
   */
  @Get()
  async findAll() {
    return this.clientsService.getAllClients();
  }
}
