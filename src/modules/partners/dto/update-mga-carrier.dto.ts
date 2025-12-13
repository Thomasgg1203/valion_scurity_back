import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMgaCarrierDto {
  @ApiPropertyOptional({ description: 'Notes about appetite for this relationship' })
  @IsOptional()
  @IsString()
  appetiteNotes?: string;

  @ApiPropertyOptional({ description: 'User who updated the relationship', example: 'editor@example.com' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  updatedBy?: string;

  @ApiPropertyOptional({ description: 'Whether the relation is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
