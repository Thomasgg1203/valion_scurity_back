import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommodityDto {
  @ApiProperty({
    description: 'Commodity name.',
    maxLength: 150,
    example: 'Electronics',
  })
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Commodity description.',
    example: 'Goods such as phones, laptops and other electronics.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
