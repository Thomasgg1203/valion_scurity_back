import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IamService } from './iam.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('IAM - Roles and Permissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('roles')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.iamService.createRole(dto);
  }

  @Get('roles')
  @ApiOperation({ summary: 'List all active roles' })
  findAllRoles() {
    return this.iamService.findAllRoles();
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get a role by ID' })
  findOneRole(@Param('id') id: string) {
    return this.iamService.findOneRole(id);
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: 'Update a role' })
  updateRole(@Param('id') id: string, @Body() dto: Partial<CreateRoleDto>) {
    return this.iamService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'Delete a role' })
  deleteRole(@Param('id') id: string) {
    return this.iamService.deleteRole(id);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'List all base permissions' })
  findAllPermissions() {
    return this.iamService.findAllPermissions();
  }

  @Post('roles/permissions')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  assignPermissions(@Body() dto: AssignPermissionsDto) {
    return this.iamService.assignPermissionsToRole(dto.roleId, dto.permissionIds);
  }

  @Post('users/role')
  @ApiOperation({ summary: 'Assign a role to a user' })
  assignRole(@Body() dto: AssignRoleDto) {
    return this.iamService.assignRoleToUser(dto.userId, dto.roleId);
  }

  @Get('me/permissions/:userId')
  @ApiOperation({ summary: "Get a user's permissions" })
  getUserPermissions(@Param('userId') userId: string) {
    return this.iamService.getUserPermissions(userId);
  }
}
