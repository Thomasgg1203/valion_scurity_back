import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { IamService } from './iam.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('roles')
  createRole(@Body() dto: CreateRoleDto) {
    return this.iamService.createRole(dto);
  }

  @Get('roles')
  findAllRoles() {
    return this.iamService.findAllRoles();
  }

  @Get('roles/:id')
  findOneRole(@Param('id') id: string) {
    return this.iamService.findOneRole(id);
  }

  @Patch('roles/:id')
  updateRole(@Param('id') id: string, @Body() dto: Partial<CreateRoleDto>) {
    return this.iamService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  deleteRole(@Param('id') id: string) {
    return this.iamService.deleteRole(id);
  }

  @Get('permissions')
  findAllPermissions() {
    return this.iamService.findAllPermissions();
  }

  @Post('roles/permissions')
  assignPermissions(@Body() dto: AssignPermissionsDto) {
    return this.iamService.assignPermissionsToRole(dto.roleId, dto.permissionIds);
  }

  @Post('users/role')
  assignRole(@Body() dto: AssignRoleDto) {
    return this.iamService.assignRoleToUser(dto.userId, dto.roleId);
  }

  @Get('me/permissions/:userId')
  getUserPermissions(@Param('userId') userId: string) {
    return this.iamService.getUserPermissions(userId);
  }
}
