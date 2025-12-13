import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCarrierDto {
  @ApiProperty({ description: 'Unique carrier name', example: 'Contoso Insurance' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ description: 'Additional notes about the carrier' })
  @IsOptional()
  @IsString()
  notes?: string;
}
