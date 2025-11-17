import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Controllers & Services
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

// Infrastructure
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { RoleEntity } from '../../infrastructure/database/entities/role.entity';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/auth/user.repository.impl';

// Core use-cases
import { LoginUseCase } from '../../core/use-cases/auth/login.usecase';
import { GetMeUseCase } from '../../core/use-cases/auth/get-me.usecase';

// Domain repository interface
import { USER_REPOSITORY } from 'src/infrastructure/repositories/auth/tokens';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET environment variable must be set');
        }
        return {
          secret,
          signOptions: { expiresIn: '8h' },
        };
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    UserRepositoryImpl,
    {
      provide: USER_REPOSITORY,
      useExisting: UserRepositoryImpl,
    },
    LoginUseCase,
    GetMeUseCase,
  ],

  exports: [AuthService, JwtModule],
})
export class AuthModule {}
