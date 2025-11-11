import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: "Registered user's email address.",
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User's password for authentication.",
    example: 'MySecurePassword123!!',
  })
  @IsString()
  password: string;
}
