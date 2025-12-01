import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiPropertyOptional({
    description: 'Role name. Must be unique if updated. Optional field.',
    example: 'Supervisor',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Role description. Can be partially updated or left as is.',
    example: 'Role responsible for supervising operations and reviewing reports.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
