import { DataSource } from 'typeorm';
import { seedInitialData } from './seed.initial';
import { seedStates } from './seed.states';
import { seedMGAs } from './seed.mga';
import { seedCarriers } from './seed.carrier';
import { seedMgaCarriers } from './seed.mga-carrier';
import { seedLineOfBusiness } from './seed.line-of-business';
import { seedCoverages } from './seed.coverage';
import { seedCommodities } from './seed.comodit';
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
import { CommodityEntity } from '../entities/commodity.entity';

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
      CommodityEntity,
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
    await seedCommodities;
  } catch (err) {
    console.error('❌ Error running seeder:', err);
  } finally {
    await dataSource.destroy();
  }
})();
