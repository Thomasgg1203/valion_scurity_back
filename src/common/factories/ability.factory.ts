import { Injectable } from '@nestjs/common';
import { AbilityBuilder, AbilityClass, ExtractSubjectType, Ability } from '@casl/ability';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermissionEntity } from '../../infrastructure/database/entities/role-permission.entity';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = string | 'all';

export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectRepository(RolePermissionEntity)
    private readonly rolePermRepo: Repository<RolePermissionEntity>,
  ) {}

  async defineAbility(user: UserEntity) {
    const { can, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

    if (user.role?.name === 'SuperAdmin') {
      can('manage', 'all');
    } else {
      const rolePerms = await this.rolePermRepo.find({
        where: { role: { id: user.role.id } },
        relations: ['permission'],
      });

      rolePerms.forEach((rp) => {
        can(rp.permission.action as Actions, rp.permission.subject as Subjects);
      });
    }

    return build({
      detectSubjectType: (item) => item as ExtractSubjectType<Subjects>,
    });
  }
}
