import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCommodityDto {
  @ApiPropertyOptional({
    description: 'Commodity name.',
    maxLength: 150,
    example: 'Electronics',
  })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Commodity description.',
    example: 'Goods such as phones, laptops and other electronics.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
