import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { QueryPanelService } from './query-panel.service';
import { QueryPanelFieldsResponseDto } from './types/query-field.type';
import { RunQueryDto } from './dto/run-query.dto';
import { QueryPanelResultDto } from './types/query-result.type';
import { QueryPanelResultItemSwaggerDto } from './types/query-result.swagger';

@ApiTags('Query Panel')
@ApiExtraModels(QueryPanelResultItemSwaggerDto)
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
  @ApiOkResponse({
    description: 'Resultados del Query Panel para todas las combinaciones MGA-Carrier',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(QueryPanelResultItemSwaggerDto) },
    },
  })
  async run(@Body() dto: RunQueryDto): Promise<QueryPanelResultDto> {
    return this.service.runQuery(dto);
  }
}
