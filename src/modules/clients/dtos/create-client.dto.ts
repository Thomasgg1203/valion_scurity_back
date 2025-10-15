import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
/**
 * DTO (Data Transfer Object) para creación de clientes.
 * Asegura que los datos recibidos desde el frontend sean válidos.
 */
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
