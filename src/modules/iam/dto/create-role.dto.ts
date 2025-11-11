import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name. Must be unique and not empty.',
    example: 'Administrator',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Brief description of the role or its functions.',
    example: 'Role with full permissions in the system.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
