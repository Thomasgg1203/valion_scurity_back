import { DataSource } from 'typeorm';
import { PermissionEntity } from '../entities/permission.entity';

export const seedPermissions = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(PermissionEntity);

  const permissions = [
    // Guidelines
    { action: 'create', subject: 'guideline', description: 'Crear guías' },
    { action: 'read', subject: 'guideline', description: 'Ver guías' },
    { action: 'update', subject: 'guideline', description: 'Editar guías' },
    { action: 'delete', subject: 'guideline', description: 'Eliminar guías' },

    // Users
    { action: 'read', subject: 'user', description: 'Ver usuarios' },
  ];

  for (const p of permissions) {
    const exists = await repo.findOne({ where: { action: p.action, subject: p.subject } });
    if (!exists) await repo.save(repo.create(p));
  }

  console.log('✅ Permisos base insertados');
};
