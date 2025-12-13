import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLimitUnitDto {
  @ApiPropertyOptional({
    description: 'Unique code for the limit unit.',
    maxLength: 20,
    example: 'PER_ACC',
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    description: 'Display name for the limit unit.',
    maxLength: 50,
    example: 'Per Accident',
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  name?: string;
}
