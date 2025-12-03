import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { QueryFilterDto } from './filter.dto';

export class RunQueryDto {
  @ApiProperty({
    description: 'Listado de filtros que alimentan el motor del Query Panel.',
    type: [QueryFilterDto],
    example: [
      { field: 'state', operator: '=', value: 'TX' },
      { field: 'commodity', operator: 'IN', value: ['Hazmat', 'Oilfield'] },
      { field: 'radius', operator: '>', value: 300 },
    ],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QueryFilterDto)
  filters: QueryFilterDto[] = [];

  @ApiProperty({
    description:
      'Opcional: id de un preset guardado. Si se envia, los filtros del preset se mezclan con los filtros manuales.',
    required: false,
    example: '7f9c94d9-52d4-48b8-9d14-8e4b4dc8f9ec',
  })
  @IsOptional()
  @IsUUID()
  presetId?: string;
}
