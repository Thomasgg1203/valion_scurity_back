import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLimitUnitDto {
  @ApiProperty({
    description: 'Unique code for the limit unit.',
    maxLength: 20,
    example: 'PER_ACC',
  })
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Display name for the limit unit.',
    maxLength: 50,
    example: 'Per Accident',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;
}
