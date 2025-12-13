import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMgaDto {
  @ApiProperty({ description: 'Unique MGA name', example: 'Acme MGA' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ description: 'Website URL', example: 'https://acme.example.com' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  site?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
