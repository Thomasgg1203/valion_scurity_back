import { Module } from '@nestjs/common';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from 'src/infrastructure/database/entities/role.entity';
import { PermissionEntity } from 'src/infrastructure/database/entities/permission.entity';
import { RolePermissionEntity } from 'src/infrastructure/database/entities/role-permission.entity';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, PermissionEntity, RolePermissionEntity, UserEntity]),
  ],
  controllers: [IamController],
  providers: [IamService],
  exports: [IamService, TypeOrmModule],
})
export class IamModule {}
