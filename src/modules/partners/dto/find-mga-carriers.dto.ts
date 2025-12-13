import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindMgaCarriersDto {
  @ApiPropertyOptional({ description: 'Page number for pagination (starts at 1).', example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Number of records per page.', example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Search text to filter by concat name or notes.',
    example: 'Acme / Contoso',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by MGA id.',
    example: '8b24b91c-2e45-4a6b-9e35-2b454e8bcf1c',
  })
  @IsOptional()
  @IsUUID()
  mgaId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Carrier id.',
    example: '6d7d8c1b-3a21-4a6c-9f11-9c9090ad6df0',
  })
  @IsOptional()
  @IsUUID()
  carrierId?: string;

  @ApiPropertyOptional({
    description: 'Filter by active state.',
    example: 'true',
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
