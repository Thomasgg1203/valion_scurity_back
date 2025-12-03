import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { QueryPanelService } from './query-panel.service';
import { QueryPanelFieldsResponseDto } from './types/query-field.type';
import { RunQueryDto } from './dto/run-query.dto';
import { QueryPanelResultDto } from './types/query-result.type';

@ApiTags('Query Panel')
@Controller('query-panel')
export class QueryPanelController {
  constructor(private readonly service: QueryPanelService) {}

  /**
   * Devuelve todos los campos disponibles para construir filtros
   * en el Query Panel, junto con sus opciones (Estados, Commodities, etc.).
   */
  @Get('fields')
  @ApiOperation({ summary: 'Campos disponibles para filtros' })
  async getFields(): Promise<QueryPanelFieldsResponseDto> {
    return this.service.getAvailableFields();
  }

  @Get('presets')
  @ApiOperation({ summary: 'Listado de presets del Query Panel' })
  async getPresets() {
    return this.service.listPresets();
  }

  @Get('presets/:id')
  @ApiOperation({ summary: 'Detalle de un preset' })
  async getPreset(@Param('id') id: string) {
    return this.service.getPreset(id);
  }

  @Post('run')
  @ApiOperation({ summary: 'Ejecutar el motor del Query Panel' })
  async run(@Body() dto: RunQueryDto): Promise<QueryPanelResultDto> {
    return this.service.runQuery(dto);
  }
}
