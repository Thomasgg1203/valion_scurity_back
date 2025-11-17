import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { UserRepository } from '../user.repository';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import { User } from 'src/core/models/user.model';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOne({
      where: { email, deletedAt: IsNull() },
      relations: ['role'],
    });

    if (!user) return null;

    return new User({
      id: user.id,
      email: user.email,
      password: user.password,
      roleId: user.role?.id,
      roleName: user.role?.name,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.repo.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['role'],
    });

    if (!user) return null;

    return new User({
      id: user.id,
      email: user.email,
      roleName: user.role?.name,
      roleId: user.role?.id,
    });
  }
}
