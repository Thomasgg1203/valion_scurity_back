import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

export interface RequestWithUser extends Request {
  user: UserEntity;
}

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT token.',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Get current user info',
    description: 'Returns information about the currently authenticated user.',
  })
  me(@Req() req: RequestWithUser) {
    return this.authService.me(req.user.id);
  }
}
