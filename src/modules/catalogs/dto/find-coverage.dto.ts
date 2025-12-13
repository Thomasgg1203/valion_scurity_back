import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsNumberString } from 'class-validator';

export class FindCoverageDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination.',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of records per page.',
    example: '10',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Search text to filter by name or code.',
    example: 'liability',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by line of business ID.',
    example: '8b24b91c-2e45-4a6b-9e35-2b454e8bcf1c',
  })
  @IsOptional()
  @IsUUID()
  lobId?: string;
}
