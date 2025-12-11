import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCoverageDto {
  @ApiProperty({
    description: 'Unique code for the coverage.',
    maxLength: 50,
    example: 'CSL',
  })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Coverage name.',
    maxLength: 150,
    example: 'Auto Liability (Combined Single Limit)',
  })
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Coverage description.',
    required: false,
    example: 'Auto liability covering bodily injury and property damage.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Associated line of business ID.',
    example: '8b24b91c-2e45-4a6b-9e35-2b454e8bcf1c',
  })
  @IsUUID()
  @IsNotEmpty()
  lobId: string;
}
