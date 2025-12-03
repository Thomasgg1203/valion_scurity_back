import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryPanelService } from './query-panel.service';
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

const createRepoMock = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn((dto) => dto),
});

describe('QueryPanelService', () => {
  let service: QueryPanelService;
  const repoMocks = {
    stateRepo: createRepoMock(),
    commodityRepo: createRepoMock(),
    lobRepo: createRepoMock(),
    coverageRepo: createRepoMock(),
    limitUnitRepo: createRepoMock(),
    guidelineFieldRepo: createRepoMock(),
    mgaCarrierRepo: createRepoMock(),
    appetiteRepo: createRepoMock(),
    guidelineRuleRepo: createRepoMock(),
    stateRuleRepo: createRepoMock(),
    exclusionRepo: createRepoMock(),
    presetRepo: createRepoMock(),
  };

  beforeEach(async () => {
    Object.values(repoMocks).forEach((mock) => {
      mock.find.mockReset();
      mock.findOne.mockReset();
      mock.save.mockReset();
      mock.create.mockReset();
    });

    const module = await Test.createTestingModule({
      providers: [
        QueryPanelService,
        { provide: getRepositoryToken(StateEntity), useValue: repoMocks.stateRepo },
        { provide: getRepositoryToken(CommodityEntity), useValue: repoMocks.commodityRepo },
        { provide: getRepositoryToken(LineOfBusinessEntity), useValue: repoMocks.lobRepo },
        { provide: getRepositoryToken(CoverageEntity), useValue: repoMocks.coverageRepo },
        { provide: getRepositoryToken(LimitUnitEntity), useValue: repoMocks.limitUnitRepo },
        {
          provide: getRepositoryToken(GuidelineFieldEntity),
          useValue: repoMocks.guidelineFieldRepo,
        },
        { provide: getRepositoryToken(MgaCarrierEntity), useValue: repoMocks.mgaCarrierRepo },
        { provide: getRepositoryToken(AppetiteCommodityEntity), useValue: repoMocks.appetiteRepo },
        { provide: getRepositoryToken(GuidelineRuleEntity), useValue: repoMocks.guidelineRuleRepo },
        { provide: getRepositoryToken(StateRuleEntity), useValue: repoMocks.stateRuleRepo },
        { provide: getRepositoryToken(ExclusionEntity), useValue: repoMocks.exclusionRepo },
        { provide: getRepositoryToken(QueryPresetEntity), useValue: repoMocks.presetRepo },
      ],
    }).compile();

    service = module.get(QueryPanelService);
  });

  it('compone los campos disponibles con opciones de catalogos y guideline fields', async () => {
    repoMocks.stateRepo.find.mockResolvedValue([{ id: 'st-tx', code: 'TX', name: 'Texas' }]);
    repoMocks.commodityRepo.find.mockResolvedValue([{ id: 'com-1', name: 'Hazmat' }]);
    repoMocks.lobRepo.find.mockResolvedValue([{ id: 'lob-1', code: 'TRK', name: 'Trucking' }]);
    repoMocks.coverageRepo.find.mockResolvedValue([
      { id: 'cov-1', name: 'Liability', lob: { id: 'lob-1', code: 'TRK', name: 'Trucking' } },
    ]);
    repoMocks.limitUnitRepo.find.mockResolvedValue([{ id: 'lu-1', code: 'USD', name: 'USD' }]);
    repoMocks.guidelineFieldRepo.find.mockResolvedValue([
      {
        id: 'gf-1',
        name: 'driver_age',
        type: 'number',
        category: { name: 'Driver Information' },
      },
    ]);

    const response = await service.getAvailableFields();
    const stateField = response.fields.find((f) => f.key === 'state');
    const commodityField = response.fields.find((f) => f.key === 'commodity');
    const guidelineField = response.fields.find((f) => f.key === 'driver_age');

    expect(response.fields.length).toBeGreaterThan(4);
    expect(stateField?.options?.[0].label).toContain('TX');
    expect(commodityField?.options?.[0].label).toBe('Hazmat');
    expect(guidelineField?.category).toBe('Driver Information');
    expect(guidelineField?.operators).toContain('>');
  });

  it('evalua appetite, reglas y exclusiones para devolver la decision final', async () => {
    const stateTx = { id: 'st-tx', code: 'TX', name: 'Texas' } as StateEntity;
    const commodityHazmat = { id: 'com-haz', name: 'Hazmat' } as CommodityEntity;
    const mgaCarrier = {
      id: 'mc-1',
      mga: { id: 'mga-1', name: 'MGA1' },
      carrier: { id: 'car-1', name: 'Carrier1' },
    } as MgaCarrierEntity;

    repoMocks.stateRepo.find.mockResolvedValue([stateTx]);
    repoMocks.commodityRepo.find.mockResolvedValue([commodityHazmat]);
    repoMocks.lobRepo.find.mockResolvedValue([]);
    repoMocks.coverageRepo.find.mockResolvedValue([]);
    repoMocks.limitUnitRepo.find.mockResolvedValue([]);
    repoMocks.guidelineFieldRepo.find.mockResolvedValue([]);
    repoMocks.mgaCarrierRepo.find.mockResolvedValue([mgaCarrier]);
    repoMocks.appetiteRepo.find.mockResolvedValue([
      {
        id: 'ap-1',
        mgaCarrier,
        commodity: commodityHazmat,
        accepted: false,
        status: 'DECLINED',
        notes: 'Hazmat declined in seed',
      } as AppetiteCommodityEntity,
    ]);
    repoMocks.guidelineRuleRepo.find.mockResolvedValue([
      {
        id: 'gr-1',
        mgaCarrier,
        field: { id: 'gf-2', name: 'radius', type: 'number' } as GuidelineFieldEntity,
        operator: '>',
        value: '300',
        comment: 'Radius above 300 declined',
      } as GuidelineRuleEntity,
    ]);
    repoMocks.stateRuleRepo.find.mockResolvedValue([
      {
        id: 'sr-1',
        mgaCarrier,
        state: stateTx,
        field: { id: 'gf-3', name: 'years_in_business', type: 'number' } as GuidelineFieldEntity,
        operator: '<',
        value: '1',
        comment: 'New ventures refer in TX',
      } as StateRuleEntity,
    ]);
    repoMocks.exclusionRepo.find.mockResolvedValue([
      { id: 'ex-1', mgaCarrier, reason: 'Manual exclusion' } as ExclusionEntity,
    ]);
    repoMocks.presetRepo.findOne.mockResolvedValue(undefined);

    const result = await service.runQuery({
      filters: [
        { field: 'commodity', operator: '=', value: 'Hazmat' },
        { field: 'radius', operator: '=', value: 400 },
        { field: 'years_in_business', operator: '=', value: 0 },
        { field: 'state', operator: '=', value: 'TX' },
      ],
    });

    expect(result.total).toBe(1);
    expect(result.items[0].decision).toBe('DECLINE');
    expect(result.items[0].guidelineHits).toHaveLength(1);
    expect(result.items[0].stateHits).toHaveLength(1);
    expect(result.items[0].exclusions).toContain('Manual exclusion');
  });
});
