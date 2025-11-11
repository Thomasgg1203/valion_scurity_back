import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({
    description: 'Unique identifier (UUID) of the user to whom the role will be assigned.',
    example: '3f8a4d1e-2c46-4d32-9b5f-4c1b7e2a123a',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Unique identifier (UUID) of the role that will be assigned to the user.',
    example: 'b2c88e5f-8e1f-42a1-a3f2-9a8d9f66d6a3',
  })
  @IsUUID()
  roleId: string;
}
