import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateClientDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
