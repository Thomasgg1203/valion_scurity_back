import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStateDto {
  @ApiPropertyOptional({
    description: 'State code (usually a 2-letter official code).',
    maxLength: 10,
    example: 'CA',
  })
  @IsString()
  @MaxLength(10)
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    description: 'Full name of the state.',
    maxLength: 100,
    example: 'California',
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;
}
