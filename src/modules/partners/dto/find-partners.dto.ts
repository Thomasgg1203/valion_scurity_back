import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindPartnersDto {
  @ApiPropertyOptional({ description: 'Page number for pagination (starts at 1).', example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Number of records per page.', example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ description: 'Text to search by name.', example: 'Acme' })
  @IsOptional()
  @IsString()
  search?: string;
}
