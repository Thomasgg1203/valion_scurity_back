import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { DataSource } from 'typeorm';
import { StateEntity } from '../entities/state.entity';
import { CommodityEntity } from '../entities/commodity.entity';
import { LineOfBusinessEntity } from '../entities/line-of-business.entity';
import { CoverageEntity } from '../entities/coverage.entity';
import { LimitUnitEntity } from '../entities/limit-unit.entity';
import { MgaCarrierEntity } from '../entities/mga-carrier.entity';
import { GuidelineCategoryEntity } from '../entities/guideline_category.entity';
import { GuidelineFieldEntity } from '../entities/guideline-field.entity';
import { AppetiteCommodityEntity } from '../entities/appetite-commodity.entity';
import { QueryPresetEntity } from '../entities/query-preset.entity';

import { createTestDataSource } from './helpers/seed-test-utils';

let db: DataSource;

beforeAll(async () => {
  db = await createTestDataSource();
});

afterAll(async () => {
  await db.destroy();
});

describe('🌱 Seed Validation Tests', () => {
  test('Estados cargados correctamente', async () => {
    const repo = db.getRepository(StateEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(40);
  });

  test('Commodities cargados correctamente', async () => {
    const repo = db.getRepository(CommodityEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(150);
  });

  test('Line of Business cargados', async () => {
    const repo = db.getRepository(LineOfBusinessEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('Coverages cargados', async () => {
    const repo = db.getRepository(CoverageEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('Limit Unit cargados', async () => {
    const repo = db.getRepository(LimitUnitEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('MGA-Carrier cargados', async () => {
    const repo = db.getRepository(MgaCarrierEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(60);
  });

  test('Categorías de guía cargadas', async () => {
    const repo = db.getRepository(GuidelineCategoryEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Fields de guía cargados', async () => {
    const repo = db.getRepository(GuidelineFieldEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Appetite Commodity cargado', async () => {
    const repo = db.getRepository(AppetiteCommodityEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Query Presets cargados', async () => {
    const repo = db.getRepository(QueryPresetEntity);
    const count = await repo.count();
    expect(count).toBeGreaterThan(0);
  });
});
