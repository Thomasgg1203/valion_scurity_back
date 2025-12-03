import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { Operator } from '../types/operators.type';
import { SUPPORTED_OPERATORS } from '../types/operators.type';

type FilterValue = string | number | boolean | (string | number | boolean)[];

export class QueryFilterDto {
  @ApiProperty({
    description: 'Campo sobre el cual aplicar el filtro (ej. state, commodity, radius, driver_age).',
    example: 'commodity',
  })
  @IsString()
  @IsNotEmpty()
  field: string;

  @ApiProperty({
    description: 'Operador a utilizar.',
    enum: SUPPORTED_OPERATORS,
    example: '=',
  })
  @IsString()
  @IsIn(SUPPORTED_OPERATORS)
  operator: Operator;

  @ApiProperty({
    description:
      'Valor del filtro. Puede ser texto, numero, booleano o un array (para IN/NOT_IN). ' +
      'Los valores de tipo select pueden enviarse por id o nombre legible.',
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' },
      { type: 'array', items: { type: 'string' } },
    ],
    example: 'Hazmat',
  })
  @IsDefined()
  value: FilterValue;

  @ApiProperty({
    description: 'Etiqueta opcional para mostrar en el frontend (no usada en la logica del motor).',
    required: false,
  })
  @IsOptional()
  @IsString()
  label?: string;
}
