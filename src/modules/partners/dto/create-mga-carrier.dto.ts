import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateMgaCarrierDto {
  @ApiProperty({ description: 'MGA identifier', example: '8b24b91c-2e45-4a6b-9e35-2b454e8bcf1c' })
  @IsUUID()
  @IsNotEmpty()
  mgaId: string;

  @ApiProperty({ description: 'Carrier identifier', example: '6d7d8c1b-3a21-4a6c-9f11-9c9090ad6df0' })
  @IsUUID()
  @IsNotEmpty()
  carrierId: string;

  @ApiPropertyOptional({ description: 'Notes about appetite for this relationship' })
  @IsOptional()
  @IsString()
  appetiteNotes?: string;

  @ApiPropertyOptional({ description: 'User who created the relationship', example: 'admin@example.com' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  createdBy?: string;
}
