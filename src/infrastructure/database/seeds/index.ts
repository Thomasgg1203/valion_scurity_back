import { DataSource } from 'typeorm';
import { seedInitialData } from './seed.initial';
import { seedStates } from './seed.states';
import { seedMGAs } from './seed.mga';
import { seedCarriers } from './seed.carrier';
import { seedMgaCarriers } from './seed.mga-carrier';
import { seedLineOfBusiness } from './seed.line-of-business';
import { seedCoverages } from './seed.coverage';
import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { UserEntity } from '../entities/user.entity';
import { config } from 'dotenv';
import { StateEntity } from '../entities/state.entity';
import { MgaCarrierEntity } from '../entities/mga-carrier.entity';
import { MgaEntity } from '../entities/mga.entity';
import { CarrierEntity } from '../entities/carrier.entity';
import { LineOfBusinessEntity } from '../entities/line-of-business.entity';
import { CoverageEntity } from '../entities/coverage.entity';
import { LimitUnitEntity } from '../entities/limit-unit.entity';
import { seedLimitUnits } from './seed.limit_unit';
import { seedCommodities } from './seed.commodity-no-accept';
import { CommodityEntity } from '../entities/commodity.entity';
import { AppetiteCommodityEntity } from '../entities/appetite-commodity.entity';
import { seedGuidelineCategories } from './seed.guidelineCategories';
import { GuidelineCategoryEntity } from '../entities/guideline_category.entity';
import { seedGuidelineFields } from './seed.guideline-field';
import { GuidelineFieldEntity } from '../entities/guideline-field.entity';
import { seedGuidelineRules } from './seed.guideline-rule';
import { GuidelineRuleEntity } from '../entities/guideline-rule.entity';
import { seedStateRules } from './seed.state_rule';
import { StateRuleEntity } from '../entities/state-rule.entity';
import { seedExclusions } from './seed.exclusion';
import { ExclusionEntity } from '../entities/exclusion.entity';
import { seedAppetiteCommodity } from './seed.appetite_commodity';
import { seedQueryPresets } from './seed.query_preset';
import { QueryPresetEntity } from '../entities/query-preset.entity';
import { seedGuidelines } from './guidelines.seed';
// import { seedAppetite } from './appetite.seed';

config();

(async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL === 'true',
    entities: [
      PermissionEntity,
      RoleEntity,
      RolePermissionEntity,
      UserEntity,
      StateEntity,
      MgaEntity,
      CarrierEntity,
      MgaCarrierEntity,
      LineOfBusinessEntity,
      CoverageEntity,
      LimitUnitEntity,
      CommodityEntity,
      AppetiteCommodityEntity,
      GuidelineCategoryEntity,
      GuidelineFieldEntity,
      GuidelineRuleEntity,
      StateRuleEntity,
      ExclusionEntity,
      QueryPresetEntity,
    ],
  });

  try {
    await seedInitialData(dataSource);
    await seedStates(dataSource);
    await seedMGAs(dataSource);
    await seedCarriers(dataSource);
    await seedMgaCarriers(dataSource);
    await seedLineOfBusiness(dataSource);
    await seedCoverages(dataSource);
    await seedLimitUnits(dataSource);
    await seedCommodities(dataSource);
    await seedGuidelineCategories(dataSource);
    await seedGuidelineFields(dataSource);
    await seedGuidelineRules(dataSource);
    await seedStateRules(dataSource);
    await seedExclusions(dataSource);
    await seedAppetiteCommodity(dataSource);
    await seedQueryPresets(dataSource);

    //
    // Guidelines (reglas, estados, exclusiones, presets)
    await seedGuidelines(dataSource);

    // Appetite (commodities + mapa ACCEPT/REFER/DECLINE)
    // await seedAppetite(dataSource);
  } catch (err) {
    console.error('❌ Error running seeder:', err);
  } finally {
    await dataSource.destroy();
  }
})();
