import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateLineOfBusinessDto {
  @ApiPropertyOptional({
    description: 'Unique code of the line of business.',
    maxLength: 50,
    example: 'AUTO_LIAB',
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    description: 'Name of the line of business.',
    maxLength: 150,
    example: 'Auto Liability',
  })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  name?: string;
}
