import { IsOptional, IsString, IsNumberString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindOptionsDto {
  @ApiPropertyOptional({
    description: 'Number of records to skip (pagination offset).',
    example: '0',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of records to take (pagination limit).',
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
