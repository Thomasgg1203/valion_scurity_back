import { DataSource } from 'typeorm';
import { seedInitialData } from './seed.initial';
import { seedStates } from './seed.states';
import { seedMGAs } from './seed.mga';
import { seedCarriers } from './seed.carrier';
import { seedMgaCarriers } from './seed.mga-carrier';
import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { UserEntity } from '../entities/user.entity';
import { config } from 'dotenv';
import { State } from '../../../modules/catalogs/entities/state.entity';
import { Mga } from '../../../modules/partners/entities/mga.entity';
import { Carrier } from '../../../modules/partners/entities/carrier.entity';
import { MgaCarrier } from '../../../modules/partners/entities/mga-carrier.entity';

;
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
    entities: [PermissionEntity, RoleEntity, RolePermissionEntity, UserEntity, State, Mga, Carrier, MgaCarrier],
  });

  try {
    await seedInitialData(dataSource);
    await seedStates(dataSource);
    await seedMGAs(dataSource);
    await seedCarriers(dataSource);
    await seedMgaCarriers(dataSource);
  } catch (err) {
    console.error('❌ Error running seeder:', err);
  } finally {
    await dataSource.destroy();
  }
})();
