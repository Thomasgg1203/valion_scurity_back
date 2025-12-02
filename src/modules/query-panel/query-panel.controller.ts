// src/modules/query-panel/query-panel.controller.ts

import { Controller, Get } from '@nestjs/common';
import { QueryPanelService } from './query-panel.service';
import { QueryPanelFieldsResponseDto } from './types/query-field.type';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Query Panel')
@Controller('query-panel')
export class QueryPanelController {
  constructor(private readonly service: QueryPanelService) {}

  /**
   * Devuelve todos los campos disponibles para construir filtros
   * en el Query Panel, junto con sus opciones (Estados, Commodities, etc.).
   */
  @Get('fields')
  async getFields(): Promise<QueryPanelFieldsResponseDto> {
    return this.service.getAvailableFields();
  }

  // Aquí luego agregaremos:
  // @Post('run') para ejecutar el motor de consulta
}
