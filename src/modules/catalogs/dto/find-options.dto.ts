import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindOptionsDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination (starts at 1).',
    example: '1',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of records per page (pagination limit).',
    example: '10',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    description: 'Search text to filter results.',
    example: 'california',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
