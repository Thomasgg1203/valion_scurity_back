import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLineOfBusinessDto {
  @ApiProperty({
    description: 'Unique code of the line of business.',
    maxLength: 50,
    example: 'AUTO_LIAB',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Name of the line of business.',
    maxLength: 150,
    example: 'Auto Liability',
  })
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  name: string;
}
