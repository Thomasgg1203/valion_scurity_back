import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AssignPermissionsDto {
  @ApiProperty({
    description: 'Unique identifier (UUID) of the role to which the permissions will be assigned.',
    example: 'd4a9c1b2-9c5f-4b2f-a6e8-5e4b3b7a9e23',
  })
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description:
      'List of unique identifiers (UUIDs) of the permissions to be assigned to the role.',
    example: ['f1a6b2d4-3c5e-4a8b-b7d9-9f2c8d3a6e4f', 'c3b8a5f9-6e1a-4d2c-b7f3-1e5a9d2b7c6d'],
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
