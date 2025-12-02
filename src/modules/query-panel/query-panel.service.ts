// src/modules/query-panel/query-panel.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { StateEntity } from 'src/infrastructure/database/entities/state.entity';
import { CommodityEntity } from 'src/infrastructure/database/entities/commodity.entity';
import { LineOfBusinessEntity } from 'src/infrastructure/database/entities/line-of-business.entity';
import { CoverageEntity } from 'src/infrastructure/database/entities/coverage.entity';
import { LimitUnitEntity } from 'src/infrastructure/database/entities/limit-unit.entity';
import { GuidelineFieldEntity } from 'src/infrastructure/database/entities/guideline-field.entity';
import {
  QueryFieldDto,
  QueryFieldOptionDto,
  QueryPanelFieldsResponseDto,
} from './types/query-field.type';

@Injectable()
export class QueryPanelService {
  constructor(
    @InjectRepository(StateEntity)
    private readonly stateRepo: Repository<StateEntity>,

    @InjectRepository(CommodityEntity)
    private readonly commodityRepo: Repository<CommodityEntity>,

    @InjectRepository(LineOfBusinessEntity)
    private readonly lobRepo: Repository<LineOfBusinessEntity>,

    @InjectRepository(CoverageEntity)
    private readonly coverageRepo: Repository<CoverageEntity>,

    @InjectRepository(LimitUnitEntity)
    private readonly limitUnitRepo: Repository<LimitUnitEntity>,

    @InjectRepository(GuidelineFieldEntity)
    private readonly guidelineFieldRepo: Repository<GuidelineFieldEntity>,
  ) {}

  /**
   * Devuelve la metadata de los campos disponibles para el Query Panel.
   * Toda la info sale de los catálogos construidos desde el Excel.
   */
  async getAvailableFields(): Promise<QueryPanelFieldsResponseDto> {
    // Cargamos catálogos desde BD (ya llenos por los seeds)
    const [states, commodities, lobs, coverages, limitUnits, guidelineFields] = await Promise.all([
      this.stateRepo.find({ where: { deletedAt: IsNull() } }),
      this.commodityRepo.find({ where: { deletedAt: IsNull() } }),
      this.lobRepo.find({ where: { deletedAt: IsNull() } }),
      this.coverageRepo.find({ where: { deletedAt: IsNull() } }),
      this.limitUnitRepo.find({ where: { deletedAt: IsNull() } }),
      this.guidelineFieldRepo.find({ where: { deletedAt: IsNull() }, relations: ['category'] }),
    ]);

    const mapOptions = (items: { id: any; name: string; code?: string }[]): QueryFieldOptionDto[] =>
      items.map((item) => ({
        value: item.id,
        label: item.code ? `${item.code} - ${item.name}` : item.name,
      }));

    const fields: QueryFieldDto[] = [];

    // === LOCATION / STATE ===
    fields.push({
      key: 'state',
      label: 'State',
      type: 'select',
      category: 'Location',
      source: 'state',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(states),
    });

    // === COMMODITY (risk type) ===
    fields.push({
      key: 'commodity',
      label: 'Commodity',
      type: 'select',
      category: 'Risk',
      source: 'commodity',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(commodities),
    });

    // === LINE OF BUSINESS ===
    fields.push({
      key: 'lob',
      label: 'Line of Business',
      type: 'select',
      category: 'Coverage',
      source: 'line_of_business',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(lobs),
    });

    // === COVERAGE ===
    fields.push({
      key: 'coverage',
      label: 'Coverage',
      type: 'select',
      category: 'Coverage',
      source: 'coverage',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(coverages),
    });

    // === LIMIT UNIT ===
    fields.push({
      key: 'limit_unit',
      label: 'Limit Unit',
      type: 'select',
      category: 'Coverage',
      source: 'limit_unit',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(limitUnits),
    });

    // === GUIDELINE FIELDS (reglas dinámicas del Excel) ===
    for (const gf of guidelineFields) {
      fields.push({
        key: `field_${gf.id}`,
        label: gf.name,
        type: 'string', // luego podemos mapear type: 'number', 'boolean', etc. según gf.type
        category: gf.category?.name || 'Guidelines',
        source: 'guideline_field',
        operators: ['=', '!=', '>', '>=', '<', '<=', 'IN', 'NOT_IN'],
      });
    }

    return { fields };
  }

  /**
   * Stub inicial para la ejecución de consultas.
   * Aquí luego conectaremos toda la lógica de:
   * - appetite_commodity
   * - guideline_rule
   * - state_rule
   * - exclusions
   */
  async runQuery(filters: any) {
    // TODO: implementar QueryBuilder dinámico basado en los filtros
    return {
      items: [],
      total: 0,
    };
  }
}
