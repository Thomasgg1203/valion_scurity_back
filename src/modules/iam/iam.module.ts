import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IamController } from './iam.controller';
import { IamService } from './iam.service';

import { RoleEntity } from 'src/infrastructure/database/entities/role.entity';
import { PermissionEntity } from 'src/infrastructure/database/entities/permission.entity';
import { RolePermissionEntity } from 'src/infrastructure/database/entities/role-permission.entity';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

// Repositorios (infraestructura)
import { RoleRepositoryImpl } from 'src/infrastructure/repositories/iam/role.repository.impl';
import { PermissionRepositoryImpl } from 'src/infrastructure/repositories/iam/permission.repository.impl';
import { RolePermissionRepositoryImpl } from 'src/infrastructure/repositories/iam/role-permission.repository.impl';

// Tokens (dominio)
import {
  ROLE_REPOSITORY,
  PERMISSION_REPOSITORY,
  ROLE_PERMISSION_REPOSITORY,
  USER_REPOSITORY,
} from 'src/core/repositories/tokens';

// Use-cases (dominio)
import { ListPermissionsUseCase } from 'src/core/use-cases/iam/list-permissions.usecase';
import { AssignPermissionsUseCase } from 'src/core/use-cases/iam/assign-permissions.usecase';
import { GetUserPermissionsUseCase } from 'src/core/use-cases/iam/get-user-permissions.usecase';
import { AssignRoleToUserUseCase } from 'src/core/use-cases/iam/assign-role-to-user.usecase';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/auth/user.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity, RolePermissionEntity, UserEntity]),
  ],

  controllers: [IamController],

  providers: [
    IamService,

    // Implementaciones reales
    RoleRepositoryImpl,
    PermissionRepositoryImpl,
    RolePermissionRepositoryImpl,
    UserRepositoryImpl,

    // Tokens → implementación
    {
      provide: ROLE_REPOSITORY,
      useExisting: RoleRepositoryImpl,
    },
    {
      provide: PERMISSION_REPOSITORY,
      useExisting: PermissionRepositoryImpl,
    },
    {
      provide: ROLE_PERMISSION_REPOSITORY,
      useExisting: RolePermissionRepositoryImpl,
    },
    {
      provide: USER_REPOSITORY,
      useExisting: UserRepositoryImpl,
    },

    // Use-cases IAM
    ListPermissionsUseCase,
    AssignPermissionsUseCase,
    AssignRoleToUserUseCase,
    GetUserPermissionsUseCase,
  ],

  exports: [IamService],
})
export class IamModule {}
