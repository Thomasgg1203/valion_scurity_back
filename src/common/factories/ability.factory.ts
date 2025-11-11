import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissionEntity } from '../../infrastructure/database/entities/role-permission.entity';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { PermissionAction } from '../../common/enums/permission-action.enum';

export type Subjects = string | 'all';
export type AppAbility = MongoAbility<[PermissionAction, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermRepo: Repository<RolePermissionEntity>,
  ) {}

  async defineAbility(user: UserEntity) {
    const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

    if (!user.role) {
      return build();
    }

    if (user.role.name === 'SuperAdmin') {
      can(PermissionAction.MANAGE, 'all');
      return build();
    }

    const rolePerms = await this.rolePermRepo.find({
      where: { role: { id: user.role.id } },
      relations: ['permission'],
    });

    rolePerms.forEach((rp) => {
      can(rp.permission.action as PermissionAction, rp.permission.subject as Subjects);
    });

    return build();
  }
}
