import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

/**
 * Módulo de clientes
 *
 * Agrupa controlador y servicio
 */
@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
