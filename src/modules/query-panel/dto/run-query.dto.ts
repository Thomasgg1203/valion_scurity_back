import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { QueryFilterDto } from './filter.dto';

export class RunQueryDto {
  @ApiProperty({
    description: 'Id opcional de MGA',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  mgaId?: string;

  @ApiProperty({
    description: 'Id opcional de Carrier',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  carrierId?: string;

  @ApiProperty({
    description: 'Id opcional de la combinación MGA-Carrier',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  mgaCarrierId?: string;

  @ApiProperty({
    description: 'Estado (código o id) para filtrar reglas de estado',
    required: false,
    example: 'TX',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Commodity id o nombre',
    required: false,
  })
  @IsOptional()
  @IsString()
  commodity?: string;

  @ApiProperty({
    description: 'Line of business id',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  lobId?: string;

  @ApiProperty({
    description: 'Coverage id',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  coverageId?: string;

  @ApiProperty({
    description: 'Limit unit id',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  limitUnitId?: string;

  @ApiProperty({
    description: 'Palabras clave (sin lógica especial aún)',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  keywords?: string[];

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
