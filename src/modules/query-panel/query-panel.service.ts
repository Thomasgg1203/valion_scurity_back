import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { StateEntity } from 'src/infrastructure/database/entities/state.entity';
import { CommodityEntity } from 'src/infrastructure/database/entities/commodity.entity';
import { LineOfBusinessEntity } from 'src/infrastructure/database/entities/line-of-business.entity';
import { CoverageEntity } from 'src/infrastructure/database/entities/coverage.entity';
import { LimitUnitEntity } from 'src/infrastructure/database/entities/limit-unit.entity';
import { GuidelineFieldEntity } from 'src/infrastructure/database/entities/guideline-field.entity';
import { MgaCarrierEntity } from 'src/infrastructure/database/entities/mga-carrier.entity';
import { AppetiteCommodityEntity } from 'src/infrastructure/database/entities/appetite-commodity.entity';
import { GuidelineRuleEntity } from 'src/infrastructure/database/entities/guideline-rule.entity';
import { StateRuleEntity } from 'src/infrastructure/database/entities/state-rule.entity';
import { ExclusionEntity } from 'src/infrastructure/database/entities/exclusion.entity';
import { QueryPresetEntity } from 'src/infrastructure/database/entities/query-preset.entity';

import {
  QueryFieldDto,
  QueryFieldType,
  QueryPanelFieldsResponseDto,
} from './types/query-field.type';
import { RunQueryDto } from './dto/run-query.dto';
import {
  DecisionStatus,
  QueryPanelResultDto,
  QueryResultItemDto,
  RuleHitDto,
  MatchedRuleDto,
} from './types/query-result.type';
import { QueryFilterDto } from './dto/filter.dto';
import { mergeAppetite } from './query-builder/appetite-merge';
import { evaluateRules } from './query-builder/rule-engine';
import {
  buildFilterIndex,
  normalizeFilters,
  NormalizedFilter,
} from './query-builder/apply-filters';
import { loadQueryData } from './query-builder/build-base-query';

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

    @InjectRepository(MgaCarrierEntity)
    private readonly mgaCarrierRepo: Repository<MgaCarrierEntity>,

    @InjectRepository(AppetiteCommodityEntity)
    private readonly appetiteRepo: Repository<AppetiteCommodityEntity>,

    @InjectRepository(GuidelineRuleEntity)
    private readonly guidelineRuleRepo: Repository<GuidelineRuleEntity>,

    @InjectRepository(StateRuleEntity)
    private readonly stateRuleRepo: Repository<StateRuleEntity>,

    @InjectRepository(ExclusionEntity)
    private readonly exclusionRepo: Repository<ExclusionEntity>,

    @InjectRepository(QueryPresetEntity)
    private readonly presetRepo: Repository<QueryPresetEntity>,
  ) {}

  /**
   * Devuelve la metadata de los campos disponibles para el Query Panel.
   * Toda la info sale de los catalogos construidos desde el Excel.
   */
  async getAvailableFields(): Promise<QueryPanelFieldsResponseDto> {
    const [states, commodities, lobs, coverages, limitUnits, guidelineFields] = await Promise.all([
      this.stateRepo.find({ where: { deletedAt: IsNull() } }),
      this.commodityRepo.find({ where: { deletedAt: IsNull() } }),
      this.lobRepo.find({ where: { deletedAt: IsNull() } }),
      this.coverageRepo.find({ where: { deletedAt: IsNull() }, relations: ['lob'] }),
      this.limitUnitRepo.find({ where: { deletedAt: IsNull() } }),
      this.guidelineFieldRepo.find({
        where: { deletedAt: IsNull() },
        relations: ['category'],
      }),
    ]);

    const mapOptions = (
      items: { id: string; name: string; code?: string }[],
      labelFromCode = false,
    ) =>
      items.map((item) => ({
        value: item.id,
        label: labelFromCode && item.code ? `${item.code} - ${item.name}` : item.name,
      }));

    const fields: QueryFieldDto[] = [];

    fields.push({
      key: 'state',
      label: 'State',
      type: 'select',
      category: 'Location',
      source: 'state',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(states, true),
    });

    fields.push({
      key: 'commodity',
      label: 'Commodity',
      type: 'select',
      category: 'Risk',
      source: 'commodity',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(commodities),
    });

    fields.push({
      key: 'lob',
      label: 'Line of Business',
      type: 'select',
      category: 'Coverage',
      source: 'line_of_business',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(lobs, true),
    });

    fields.push({
      key: 'coverage',
      label: 'Coverage',
      type: 'select',
      category: 'Coverage',
      source: 'coverage',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(coverages),
    });

    fields.push({
      key: 'limit_unit',
      label: 'Limit Unit',
      type: 'select',
      category: 'Coverage',
      source: 'limit_unit',
      operators: ['IN', 'NOT_IN', '='],
      options: mapOptions(limitUnits, true),
    });

    // Guideline fields generados a partir del Excel
    for (const gf of guidelineFields) {
      fields.push({
        key: gf.name,
        label: gf.name.replace(/_/g, ' '),
        type: this.resolveGuidelineType(gf.type),
        category: gf.category?.name || 'Guidelines',
        source: 'guideline_field',
        operators: ['=', '!=', '>', '>=', '<', '<=', 'IN', 'NOT_IN'],
        options: this.parsePossibleValues(gf.possible_values),
      });
    }

    this.applyStaticFields(fields, {
      states,
    });

    return { fields };
  }

  async listPresets() {
    const presets = await this.presetRepo.find({ where: { deletedAt: IsNull() } });
    return presets.map((preset) => ({
      id: preset.id,
      name: preset.name,
      userId: preset.userId,
      filters: this.deserializeFilters(preset.filtersJson),
    }));
  }

  async getPreset(id: string) {
    const preset = await this.presetRepo.findOne({ where: { id, deletedAt: IsNull() } });
    if (!preset) throw new NotFoundException('Query preset not found');

    return {
      id: preset.id,
      name: preset.name,
      userId: preset.userId,
      filters: this.deserializeFilters(preset.filtersJson),
    };
  }

  /**
   * Motor principal del Query Panel.
   * Orquesta los datasets (appetite, reglas, exclusiones) y devuelve un resumen
   * de decision por cada MGA-Carrier.
   */
  async runQuery(dto: RunQueryDto): Promise<QueryPanelResultDto> {
    const presetFilters = dto.presetId ? await this.loadPresetFilters(dto.presetId) : [];
    const normalizedFilters = normalizeFilters([
      ...presetFilters,
      ...this.injectTopLevelFilters(dto),
      ...(dto.filters || []),
    ]);
    const filtersIndex = buildFilterIndex(normalizedFilters);

    const data = await loadQueryData({
      mgaCarrierRepo: this.mgaCarrierRepo,
      appetiteRepo: this.appetiteRepo,
      guidelineRuleRepo: this.guidelineRuleRepo,
      stateRuleRepo: this.stateRuleRepo,
      exclusionRepo: this.exclusionRepo,
      commodityRepo: this.commodityRepo,
      stateRepo: this.stateRepo,
    });

    const commodityFilters = this.resolveCommodityFilters(filtersIndex, data.commodities);
    const stateFilters = this.resolveStateFilters(filtersIndex);

    const filteredCarriers = this.filterCarriers(data.carriers, dto);

    const appetiteByCarrier = this.groupBy(data.appetite, (a) => a.mgaCarrier.id);
    const guidelineByCarrier = this.groupBy(data.guidelineRules, (r) => r.mgaCarrier.id);
    const stateRuleByCarrier = this.groupBy(data.stateRules, (r) => r.mgaCarrier.id);
    const exclusionByCarrier = this.groupBy(data.exclusions, (e) => e.mgaCarrier.id);

    const items: QueryResultItemDto[] = filteredCarriers.map((mc) => {
      const appetiteResult = mergeAppetite(commodityFilters, appetiteByCarrier.get(mc.id) ?? []);
      const { guidelineHits, stateHits } = evaluateRules({
        filtersIndex,
        rules: guidelineByCarrier.get(mc.id) ?? [],
        stateRules: stateRuleByCarrier.get(mc.id) ?? [],
        stateFilters,
      });
      const exclusions = (exclusionByCarrier.get(mc.id) ?? [])
        .map((e) => e.reason)
        .filter(Boolean) as string[];

      const decision = this.resolveDecision(
        appetiteResult.status,
        guidelineHits,
        stateHits,
        exclusions,
      );

      const matchedRules: MatchedRuleDto[] = [
        ...guidelineHits.map((hit) => ({
          ruleId: guidelineByCarrier
            .get(mc.id)
            ?.find((r) => r.field?.name === hit.field)?.id,
          type: hit.severity,
          source: 'guideline' as const,
          description: hit.comment || `${hit.field} ${hit.operator} ${hit.value}`,
        })),
        ...stateHits.map((hit) => ({
          ruleId: stateRuleByCarrier.get(mc.id)?.find((r) => r.field?.name === hit.field)?.id,
          type: hit.severity,
          source: 'state' as const,
          description: hit.comment || `${hit.field} ${hit.operator} ${hit.value}`,
        })),
      ];

      const reasons = [
        ...matchedRules.map((r) => r.description),
        ...exclusions,
        ...appetiteResult.matches.map((m) => m.notes).filter(Boolean) as string[],
      ];

      return {
        mga: { id: mc.mga?.id, name: mc.mga?.name },
        carrier: { id: mc.carrier?.id, name: mc.carrier?.name },
        state: this.resolveStateInfo(stateFilters, data.states),
        commodity: commodityFilters[0]
          ? { id: commodityFilters[0].id, name: commodityFilters[0].name }
          : undefined,
        line_of_business: undefined,
        coverage: undefined,
        limit_unit: undefined,
        appetite: decision,
        reasons,
        limits: [],
        exclusions,
        matchedRules,
        raw: {
          appetite: appetiteResult,
          guidelineHits,
          stateHits,
        },
      };
    });

    return { items, total: items.length };
  }

  private resolveGuidelineType(rawType: string): QueryFieldType {
    switch (rawType) {
      case 'number':
      case 'integer':
        return 'number';
      case 'boolean':
        return 'boolean';
      case 'select':
        return 'select';
      case 'multiselect':
        return 'multiselect';
      default:
        return 'string';
    }
  }

  private parsePossibleValues(possible?: string | null) {
    if (!possible) return undefined;
    const values = possible
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    if (!values.length) return undefined;
    return values.map((v) => ({ value: v, label: v }));
  }

  private deserializeFilters(json?: string | null): QueryFilterDto[] {
    if (!json) return [];
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        return parsed as QueryFilterDto[];
      }
    } catch (error) {
      // ignore malformed presets
      console.log('Error', error);
    }
    return [];
  }

  private async loadPresetFilters(presetId: string): Promise<QueryFilterDto[]> {
    const preset = await this.presetRepo.findOne({ where: { id: presetId, deletedAt: IsNull() } });
    if (!preset) return [];
    return this.deserializeFilters(preset.filtersJson);
  }

  private resolveCommodityFilters(
    filtersIndex: Map<string, NormalizedFilter[]>,
    commodities: CommodityEntity[],
  ) {
    const commodityFilters = filtersIndex.get('commodity');
    if (!commodityFilters?.length) return [];

    const byId = new Map(commodities.map((c) => [c.id, c]));
    const byName = new Map(commodities.map((c) => [c.name.toLowerCase(), c]));

    const resolved = new Map<string, CommodityEntity>();

    for (const filter of commodityFilters) {
      const values = Array.isArray(filter.value) ? filter.value : [filter.value];
      for (const raw of values) {
        const rawText = String(raw).trim();
        const byIdMatch = byId.get(rawText);
        const byNameMatch = byName.get(rawText.toLowerCase());
        const commodity = byIdMatch ?? byNameMatch;
        if (commodity) {
          resolved.set(commodity.id, commodity);
        }
      }
    }

    return Array.from(resolved.values());
  }

  private resolveStateFilters(filtersIndex: Map<string, NormalizedFilter[]>) {
    const stateFilters = filtersIndex.get('state');
    if (!stateFilters?.length) return [];

    const normalized: string[] = [];
    for (const filter of stateFilters) {
      const values = Array.isArray(filter.value) ? filter.value : [filter.value];
      values.forEach((v) => normalized.push(String(v)));
    }

    return normalized;
  }

  private resolveDecision(
    appetiteStatus: DecisionStatus | 'NOT_EVALUATED',
    guidelineHits: RuleHitDto[],
    stateHits: RuleHitDto[],
    exclusions: string[],
  ): DecisionStatus {
    const order: DecisionStatus[] = ['ACCEPT', 'REFER', 'DECLINE'];
    let decision: DecisionStatus = 'ACCEPT';

    const updateDecision = (candidate: DecisionStatus) => {
      if (order.indexOf(candidate) > order.indexOf(decision)) {
        decision = candidate;
      }
    };

    if (appetiteStatus !== 'NOT_EVALUATED') {
      updateDecision(appetiteStatus);
    }

    guidelineHits.forEach((hit) => updateDecision(hit.severity));
    stateHits.forEach((hit) => updateDecision(hit.severity));

    if (exclusions.length && decision === 'ACCEPT') {
      decision = 'REFER';
    }

    return decision;
  }

  private groupBy<T>(items: T[], selector: (item: T) => string) {
    const map = new Map<string, T[]>();
    for (const item of items) {
      const key = selector(item);
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(item);
    }
    return map;
  }

  private applyStaticFields(fields: QueryFieldDto[], catalogs: { states: StateEntity[] }) {
    const map = new Map<string, QueryFieldDto>();
    fields.forEach((f) => map.set(f.key, f));

    const staticDefinitions: QueryFieldDto[] = [
      {
        key: 'radius',
        label: 'Radius',
        type: 'select',
        category: 'Operation Details',
        source: 'guideline_field',
        operators: ['=', 'IN', 'NOT_IN'],
        options: [
          { value: 'LOCAL (0-500)', label: 'Local (0-500)' },
          { value: 'INTERMEDIATE (501-1500)', label: 'Intermediate (501-1500)' },
          { value: 'UNLIMITED (1500+)', label: 'Unlimited (1500+)' },
        ],
      },
      {
        key: 'operation_scope',
        label: 'Operation Scope',
        type: 'select',
        category: 'Operation Details',
        source: 'guideline_field',
        operators: ['=', 'IN', 'NOT_IN'],
        options: [
          { value: 'STATE', label: 'State' },
          { value: 'OUT OF STATE', label: 'Out of State' },
          { value: 'MX', label: 'MX' },
          { value: 'INTERNATIONAL', label: 'International' },
        ],
      },
      {
        key: 'vehicle_type',
        label: 'Vehicle Type',
        type: 'select',
        category: 'Vehicle Information',
        source: 'guideline_field',
        operators: ['=', 'IN', 'NOT_IN'],
        options: [
          { value: 'TRUCK', label: 'Truck' },
          { value: 'TRAILER', label: 'Trailer' },
          { value: 'TRACTOR', label: 'Tractor' },
          { value: 'REEFER', label: 'Reefer' },
          { value: 'FLATBED', label: 'Flatbed' },
          { value: 'STRAIGHT', label: 'Straight' },
          { value: 'CARGO VAN', label: 'Cargo Van' },
          { value: 'PICKUP', label: 'Pickup' },
          { value: 'DRYVAN', label: 'Dryvan' },
          { value: 'CAR HAULER', label: 'Car Hauler' },
          { value: 'TANK', label: 'Tank' },
          { value: 'MIXER', label: 'Mixer' },
          { value: 'INTERMODAL', label: 'Intermodal' },
          { value: 'HOUSEHOLD GOODS MOVERS', label: 'Household Goods Movers' },
          { value: 'LIVESTOCK', label: 'Livestock' },
          { value: 'HAZARDOUS', label: 'Hazardous' },
          { value: 'TOWING', label: 'Towing' },
        ],
      },
      {
        key: 'business_type',
        label: 'Business Type',
        type: 'select',
        category: 'Company Information',
        source: 'guideline_field',
        operators: ['=', 'IN', 'NOT_IN'],
        options: [
          { value: 'DUMP', label: 'Dump' },
          { value: 'TOWING', label: 'Towing' },
          { value: 'DOES NOT APPLY', label: 'Does Not Apply' },
        ],
      },
      {
        key: 'vehicle_age',
        label: 'Vehicle Age',
        type: 'select',
        category: 'Vehicle Information',
        source: 'guideline_field',
        operators: ['=', 'IN', 'NOT_IN'],
        options: [
          { value: '0-15', label: '0-15' },
          { value: '16-20', label: '16-20' },
          { value: '21-35', label: '21-35' },
          { value: '36+', label: '36+' },
        ],
      },
      {
        key: 'uiia',
        label: 'UIIA',
        type: 'boolean',
        category: 'Operation Details',
        source: 'guideline_field',
        operators: ['='],
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        key: 'owner_exclusion',
        label: 'Owner Exclusion',
        type: 'boolean',
        category: 'Company Information',
        source: 'guideline_field',
        operators: ['='],
        options: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      },
      {
        key: 'power_units',
        label: 'Power Units',
        type: 'number',
        category: 'Operation Details',
        source: 'guideline_field',
        operators: ['=', '!=', '>', '>=', '<', '<='],
      },
      {
        key: 'operation_states',
        label: 'Operation States',
        type: 'multiselect',
        category: 'Operation Details',
        source: 'state',
        operators: ['IN', 'NOT_IN', '='],
        options: catalogs.states.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` })),
      },
    ];

    for (const def of staticDefinitions) {
      if (map.has(def.key)) {
        const existing = map.get(def.key)!;
        existing.type = def.type;
        existing.category = def.category;
        existing.source = def.source;
        existing.operators = def.operators;
        if (def.options) existing.options = def.options;
      } else {
        fields.push(def);
        map.set(def.key, def);
      }
    }
  }

  private injectTopLevelFilters(dto: RunQueryDto): QueryFilterDto[] {
    const filters: QueryFilterDto[] = [];
    if (dto.state) filters.push({ field: 'state', operator: '=', value: dto.state });
    if (dto.commodity) filters.push({ field: 'commodity', operator: '=', value: dto.commodity });
    if (dto.lobId) filters.push({ field: 'lob', operator: '=', value: dto.lobId });
    if (dto.coverageId) filters.push({ field: 'coverage', operator: '=', value: dto.coverageId });
    if (dto.limitUnitId) filters.push({ field: 'limit_unit', operator: '=', value: dto.limitUnitId });
    return filters;
  }

  private filterCarriers(carriers: MgaCarrierEntity[], dto: RunQueryDto) {
    return carriers.filter((mc) => {
      if (dto.mgaCarrierId && mc.id !== dto.mgaCarrierId) return false;
      if (dto.mgaId && mc.mga?.id !== dto.mgaId) return false;
      if (dto.carrierId && mc.carrier?.id !== dto.carrierId) return false;
      return true;
    });
  }

  private resolveStateInfo(stateFilters: string[], states: StateEntity[]) {
    if (!stateFilters.length) return undefined;
    const code = stateFilters[0];
    const match = states.find((s) => s.code === code || s.id === code);
    return match ? { code: match.code, name: match.name } : { code };
  }
}
