import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from '../../core/use-cases/auth/login.usecase';
import { GetMeUseCase } from '../../core/use-cases/auth/get-me.usecase';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    try {
      const user = await this.loginUseCase.execute(email, password);
      const payload = {
        sub: user.id,
        roleId: user.roleId,
        email: user.email,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          role: user.roleName,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async me(id: string) {
    try {
      const user = await this.getMeUseCase.execute(id);

      return {
        id: user.id,
        email: user.email,
        role: user.roleName,
      };
    } catch {
      throw new UnauthorizedException('User not found');
    }
  }
}
