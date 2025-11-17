import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/infrastructure/repositories/auth/tokens';
import type { UserRepository } from 'src/infrastructure/repositories/user.repository';

export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.users.findById(id);
    if (!user) throw new Error('User not found');

    return user;
  }
}
