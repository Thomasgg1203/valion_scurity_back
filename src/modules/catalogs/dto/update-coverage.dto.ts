import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateCoverageDto {
  @ApiPropertyOptional({
    description: 'Unique code for the coverage.',
    maxLength: 50,
    example: 'CSL',
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({
    description: 'Coverage name.',
    maxLength: 150,
    example: 'Auto Liability (Combined Single Limit)',
  })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Coverage description.',
    example: 'Auto liability covering bodily injury and property damage.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Associated line of business ID.',
    example: '8b24b91c-2e45-4a6b-9e35-2b454e8bcf1c',
  })
  @IsUUID()
  @IsOptional()
  lobId?: string;
}
