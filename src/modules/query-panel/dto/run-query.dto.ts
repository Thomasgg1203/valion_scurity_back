import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
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
    description: 'Estado (codigo o id) para filtrar reglas de estado',
    required: false,
    example: 'TX',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: 'Commodity type (nombre del commodity en las reglas)',
    required: false,
  })
  @IsOptional()
  @IsString()
  commodity_type?: string;

  @ApiProperty({
    description: 'Vehicle year',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  vehicle_year?: number;

  @ApiProperty({
    description: 'Vehicle type',
    required: false,
  })
  @IsOptional()
  @IsString()
  vehicle_type?: string;

  @ApiProperty({
    description: 'Unit count (power units)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  unit_count?: number;

  @ApiProperty({
    description: 'Is trailer',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_trailer?: boolean;

  @ApiProperty({
    description: 'Driver age',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  driver_age?: number;

  @ApiProperty({
    description: 'Years of experience',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  years_experience?: number;

  @ApiProperty({
    description: 'Has CDL',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  has_cdl?: boolean;

  @ApiProperty({
    description: 'Radius',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  radius?: number;

  @ApiProperty({
    description: 'Operation states (codes)',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  operation_states?: string[];

  @ApiProperty({
    description: 'Years in business',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  years_in_business?: number;

  @ApiProperty({
    description: 'Authority active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  authority_active?: boolean;

  @ApiProperty({
    description: 'Is hazmat',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_hazmat?: boolean;

  @ApiProperty({
    description: 'Temp control',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  temp_control?: boolean;

  @ApiProperty({
    description: 'Requested liability limit',
    required: false,
  })
  @IsOptional()
  @IsString()
  requested_liability_limit?: string;

  @ApiProperty({
    description: 'Requested coverages',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requested_coverages?: string[];

  @ApiProperty({
    description: 'Accidents last 3 years',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  accidents_last_3_years?: number;

  @ApiProperty({
    description: 'Violations count',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  violations_count?: number;

  @ApiProperty({
    description: 'CSA score',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  csa_score?: number;

  @ApiProperty({
    description: 'Company name',
    required: false,
  })
  @IsOptional()
  @IsString()
  company_name?: string;

  @ApiProperty({
    description: 'DOT number',
    required: false,
  })
  @IsOptional()
  @IsString()
  dot_number?: string;

  @ApiProperty({
    description: 'MC number',
    required: false,
  })
  @IsOptional()
  @IsString()
  mc_number?: string;

  @ApiProperty({
    description: 'Palabras clave (sin logica especial aun)',
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
