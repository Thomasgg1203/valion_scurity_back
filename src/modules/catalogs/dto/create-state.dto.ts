import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStateDto {
  @ApiProperty({
    description: 'State code (usually a 2-letter official code).',
    maxLength: 10,
    example: 'CA',
    examples: ['CA', 'AL', 'NY', 'TX'],
  })
  @IsString()
  @MaxLength(10)
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Full name of the state.',
    maxLength: 100,
    example: 'California',
    examples: ['Alabama', 'California', 'New York', 'Texas'],
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;
}
