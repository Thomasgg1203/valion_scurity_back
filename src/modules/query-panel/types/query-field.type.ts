import { Operator } from './operators.type';

export type QueryFieldType = 'string' | 'number' | 'boolean' | 'select' | 'multiselect';

export class QueryFieldOptionDto {
  value: string | number | boolean;
  label: string;
}

export class QueryFieldDto {
  /** Clave interna usada en el frontend y en el builder (ej: state, commodity, lob). */
  key: string;

  /** Etiqueta legible para el usuario. */
  label: string;

  /** Tipo de dato. */
  type: QueryFieldType;

  /** Operadores permitidos (=, !=, IN, etc.). */
  operators: Operator[];

  /** Grupo logico (para agrupar en UI: Location, Risk, Appetite, etc.). */
  category: string;

  /** Fuente de dato (tabla/entidad base). */
  source: string;

  /** Opciones cuando el campo es tipo select (Estados, Commodities, etc.). */
  options?: QueryFieldOptionDto[];
}

export class QueryPanelFieldsResponseDto {
  fields: QueryFieldDto[];
}
