import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { PermissionEntity } from '../entities/permission.entity';
import { RoleEntity } from '../entities/role.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';
import { UserEntity } from '../entities/user.entity';
import { PermissionAction } from '../../../common/enums/permission-action.enum';

config();

/**
 * 🌱 Global seeder for base roles, permissions and users.
 * - Creates all base permissions
 * - Creates SuperAdmin role and assigns all permissions
 * - Inserts SuperAdmin and other test users
 */
export const seedInitialData = async (dataSource: DataSource) => {
  await dataSource.initialize();
  console.log('⚙️ Database connection established...');

  dataSource.getRepository(PermissionEntity);
  dataSource.getRepository(RoleEntity);
  dataSource.getRepository(RolePermissionEntity);
  dataSource.getRepository(UserEntity);

  await dataSource.transaction(async (manager) => {
    // ========== 1️⃣ BASE PERMISSIONS ==========
    const basePermissions = [
      // Users
      { action: PermissionAction.CREATE, subject: 'user', description: 'Create users' },
      { action: PermissionAction.READ, subject: 'user', description: 'View users' },
      { action: PermissionAction.UPDATE, subject: 'user', description: 'Edit users' },
      { action: PermissionAction.DELETE, subject: 'user', description: 'Delete users' },
      // Roles
      { action: PermissionAction.CREATE, subject: 'role', description: 'Create roles' },
      { action: PermissionAction.READ, subject: 'role', description: 'View roles' },
      { action: PermissionAction.UPDATE, subject: 'role', description: 'Edit roles' },
      { action: PermissionAction.DELETE, subject: 'role', description: 'Delete roles' },
      // Permissions
      { action: PermissionAction.READ, subject: 'permission', description: 'View permissions' },
      { action: PermissionAction.UPDATE, subject: 'permission', description: 'Edit permissions' },
      // Guidelines
      { action: PermissionAction.CREATE, subject: 'guideline', description: 'Create guidelines' },
      { action: PermissionAction.READ, subject: 'guideline', description: 'View guidelines' },
      { action: PermissionAction.UPDATE, subject: 'guideline', description: 'Edit guidelines' },
      { action: PermissionAction.DELETE, subject: 'guideline', description: 'Delete guidelines' },
      // Partners
      { action: PermissionAction.CREATE, subject: 'partner', description: 'Create partners' },
      { action: PermissionAction.READ, subject: 'partner', description: 'View partners' },
      { action: PermissionAction.UPDATE, subject: 'partner', description: 'Edit partners' },
      { action: PermissionAction.DELETE, subject: 'partner', description: 'Delete partners' },
      // Catalogs
      { action: PermissionAction.CREATE, subject: 'catalog', description: 'Create catalog items' },
      { action: PermissionAction.READ, subject: 'catalog', description: 'View catalog items' },
      { action: PermissionAction.UPDATE, subject: 'catalog', description: 'Edit catalog items' },
      { action: PermissionAction.DELETE, subject: 'catalog', description: 'Delete catalog items' },
      // Reports
      { action: PermissionAction.CREATE, subject: 'report', description: 'Create reports' },
      { action: PermissionAction.READ, subject: 'report', description: 'View reports' },
      { action: PermissionAction.UPDATE, subject: 'report', description: 'Edit reports' },
      { action: PermissionAction.DELETE, subject: 'report', description: 'Delete reports' },
      // Audit
      { action: PermissionAction.READ, subject: 'audit', description: 'View audit logs' },
      // Rules
      { action: PermissionAction.CREATE, subject: 'rule', description: 'Create rules' },
      { action: PermissionAction.READ, subject: 'rule', description: 'View rules' },
      { action: PermissionAction.UPDATE, subject: 'rule', description: 'Edit rules' },
      { action: PermissionAction.DELETE, subject: 'rule', description: 'Delete rules' },
    ];

    for (const perm of basePermissions) {
      const exists = await manager.findOne(PermissionEntity, {
        where: { action: perm.action, subject: perm.subject },
      });
      if (!exists) {
        await manager.save(PermissionEntity, manager.create(PermissionEntity, perm));
      }
    }
    console.log('✅ Base permissions inserted.');

    // ========== 2️⃣ SUPER ADMIN ROLE ==========
    let superAdmin = await manager.findOne(RoleEntity, { where: { name: 'SuperAdmin' } });
    if (!superAdmin) {
      superAdmin = manager.create(RoleEntity, {
        name: 'SuperAdmin',
        description: 'Full system access with all permissions',
      });
      await manager.save(RoleEntity, superAdmin);
      console.log('✅ SuperAdmin role created.');
    }

    // ========== 3️⃣ ASSIGN ALL PERMISSIONS TO SUPERADMIN ==========
    const allPerms = await manager.find(PermissionEntity);
    const existingRelations = await manager.find(RolePermissionEntity, {
      where: { role: { id: superAdmin.id } },
      relations: ['permission'],
    });

    const missingPerms = allPerms.filter(
      (p) => !existingRelations.some((rp) => rp.permission.id === p.id),
    );

    if (missingPerms.length > 0) {
      const newRelations = missingPerms.map((p) =>
        manager.create(RolePermissionEntity, { role: superAdmin, permission: p }),
      );
      await manager.save(RolePermissionEntity, newRelations);
      console.log(`✅ ${newRelations.length} permissions assigned to SuperAdmin.`);
    } else {
      console.log('ℹ️ SuperAdmin already has all permissions.');
    }

    // ========== 4️⃣ USERS ==========
    const usersToInsert = [
      {
        email: 'super@valion.com',
        password: await bcrypt.hash('super123', 10),
        firstName: 'System',
        lastName: 'Administrator',
        role: superAdmin,
      },
      {
        email: 'manager@valion.com',
        password: await bcrypt.hash('manager123', 10),
        firstName: 'Project',
        lastName: 'Manager',
      },
      {
        email: 'viewer@valion.com',
        password: await bcrypt.hash('viewer123', 10),
        firstName: 'Data',
        lastName: 'Viewer',
      },
    ];

    for (const u of usersToInsert) {
      const exists = await manager.findOne(UserEntity, { where: { email: u.email } });
      if (!exists) {
        await manager.save(UserEntity, manager.create(UserEntity, u));
        console.log(`👤 User created: ${u.email}`);
      }
    }
  });

  console.log('🌱 Initial seeding completed successfully!');
};
