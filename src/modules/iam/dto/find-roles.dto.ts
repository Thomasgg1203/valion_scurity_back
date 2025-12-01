import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class FindRolesDto {
  @ApiPropertyOptional({
    description:
      'Page number for pagination. Must be a positive integer in string format. If not submitted, the default value defined in the service is used.',
    example: '1',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'page must be a numeric string' })
  page?: string;

  @ApiPropertyOptional({
    description:
      'Number of records per page. Must be a positive integer in string format. If not submitted, the default limit is applied.',
    example: '10',
  })
  @IsOptional()
  @IsNumberString({}, { message: 'limit must be a numeric string' })
  limit?: string;

  @ApiPropertyOptional({
    description:
      'Text to filter roles by name. A partial search (ILIKE) is applied to the name field.',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
