import { QueryFilterDto } from '../dto/filter.dto';
import { Operator } from '../types/operators.type';

export type FilterValue = string | number | boolean;

export interface NormalizedFilter {
  field: string;
  operator: Operator;
  value: FilterValue | FilterValue[];
}

const normalizePrimitive = (raw: unknown): FilterValue => {
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'number') return raw;

  const rawString = String(raw).trim();
  if (rawString.toLowerCase() === 'true') return true;
  if (rawString.toLowerCase() === 'false') return false;

  const asNumber = Number(rawString);
  if (!Number.isNaN(asNumber) && rawString !== '') return asNumber;

  return rawString;
};

const splitCommaValues = (value: unknown): (string | number | boolean)[] => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [value as string | number | boolean];

  if (!value.includes(',')) return [value];

  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
};

export const normalizeFilters = (filters: QueryFilterDto[]): NormalizedFilter[] =>
  (filters ?? []).map((filter) => {
    const maybeArray = ['IN', 'NOT_IN'].includes(filter.operator)
      ? splitCommaValues(filter.value)
      : filter.value;

    const normalized = Array.isArray(maybeArray)
      ? maybeArray.map((v) => normalizePrimitive(v))
      : normalizePrimitive(maybeArray);

    return {
      field: filter.field,
      operator: filter.operator,
      value: normalized,
    };
  });

export const buildFilterIndex = (filters: NormalizedFilter[]) => {
  const index = new Map<string, NormalizedFilter[]>();

  for (const filter of filters) {
    if (!index.has(filter.field)) {
      index.set(filter.field, []);
    }
    index.get(filter.field)?.push(filter);
  }

  return index;
};

const areNumbers = (a: FilterValue, b: FilterValue) =>
  typeof a === 'number' && typeof b === 'number' && !Number.isNaN(a) && !Number.isNaN(b);

const compareValues = (operator: Operator, provided: FilterValue, expected: FilterValue) => {
  const asString = (v: FilterValue) => (typeof v === 'string' ? v.toLowerCase() : v);

  switch (operator) {
    case '=':
      return provided === expected || asString(provided) === asString(expected);
    case '!=':
      return !(provided === expected || asString(provided) === asString(expected));
    case '>':
      return areNumbers(provided, expected) ? provided > expected : false;
    case '>=':
      return areNumbers(provided, expected) ? provided >= expected : false;
    case '<':
      return areNumbers(provided, expected) ? provided < expected : false;
    case '<=':
      return areNumbers(provided, expected) ? provided <= expected : false;
    case 'IN': {
      const list = Array.isArray(provided) ? provided : [provided];
      return list.some((v) => v === expected || asString(v) === asString(expected));
    }
    case 'NOT_IN': {
      const list = Array.isArray(provided) ? provided : [provided];
      return !list.some((v) => v === expected || asString(v) === asString(expected));
    }
    default:
      return false;
  }
};

export const valueMatchesRule = (
  ruleOperator: Operator,
  ruleValue: string,
  provided: FilterValue | FilterValue[],
) => {
  const providedList = Array.isArray(provided) ? provided : [provided];
  const normalizedRuleValue = normalizePrimitive(ruleValue);

  return providedList.some((val) => compareValues(ruleOperator, val, normalizedRuleValue));
};
