import { Controller, Get, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ControllerResponse } from 'src/common/interceptors/response.interceptor';
import { Client } from 'src/core/domain/client.entity';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async getAll(
    @Query('page') page?: number,
    @Query('perPage') perPage?: number,
  ): Promise<ControllerResponse<Client[]>> {
    const { data, total } = await this.clientsService.getAllClients(
      page ? Number(page) : undefined,
      perPage ? Number(perPage) : undefined,
    );

    return {
      data,
      message: 'Clients successfully obtained',
      meta: {
        total,
        page: page ? Number(page) : 1,
        perPage: perPage ? Number(perPage) : total,
      },
    };
  }
}
