import { Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from 'src/infrastructure/repositories/auth/tokens';
import type { UserRepository } from 'src/infrastructure/repositories/user.repository';

export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    return user;
  }
}
