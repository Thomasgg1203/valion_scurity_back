import { DataSource } from 'typeorm';
import { seedInitialData } from './seed.initial';
import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { UserEntity } from '../entities/user.entity';
import { config } from 'dotenv';
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
    entities: [PermissionEntity, RoleEntity, RolePermissionEntity, UserEntity],
  });

  try {
    await seedInitialData(dataSource);
  } catch (err) {
    console.error('❌ Error running seeder:', err);
  } finally {
    await dataSource.destroy();
  }
})();
