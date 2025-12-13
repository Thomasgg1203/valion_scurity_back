import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PartnersService } from './partners.service';
import { CreateMgaDto } from './dto/create-mga.dto';
import { UpdateMgaDto } from './dto/update-mga.dto';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { CreateMgaCarrierDto } from './dto/create-mga-carrier.dto';
import { UpdateMgaCarrierDto } from './dto/update-mga-carrier.dto';
import { FindPartnersDto } from './dto/find-partners.dto';
import { FindMgaCarriersDto } from './dto/find-mga-carriers.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Partners')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('partners')
export class PartnersController {
  constructor(private readonly service: PartnersService) {}

  // MGAs
  @Get('mgas')
  @ApiOperation({ summary: 'List MGAs (paginated)' })
  @ApiResponse({ status: 200, description: 'MGAs retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllMgas(@Query() query: FindPartnersDto) {
    return this.service.findAllMgas({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
    });
  }

  @Get('mgas/:id')
  @ApiOperation({ summary: 'Get MGA by id' })
  @ApiResponse({ status: 200, description: 'MGA retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'MGA not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findMga(@Param('id') id: string) {
    return this.service.findMga(id);
  }

  @Post('mgas')
  @ApiOperation({ summary: 'Create MGA' })
  @ApiResponse({ status: 201, description: 'MGA created successfully.' })
  @ApiResponse({ status: 409, description: 'MGA name already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createMga(@Body() dto: CreateMgaDto) {
    return this.service.createMga(dto);
  }

  @Put('mgas/:id')
  @ApiOperation({ summary: 'Update MGA' })
  @ApiResponse({ status: 200, description: 'MGA updated successfully.' })
  @ApiResponse({ status: 404, description: 'MGA not found.' })
  @ApiResponse({ status: 409, description: 'MGA name already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateMga(@Param('id') id: string, @Body() dto: UpdateMgaDto) {
    return this.service.updateMga(id, dto);
  }

  @Delete('mgas/:id')
  @ApiOperation({ summary: 'Soft delete MGA' })
  @ApiResponse({ status: 200, description: 'MGA deleted successfully.' })
  @ApiResponse({ status: 404, description: 'MGA not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  deleteMga(@Param('id') id: string) {
    return this.service.deleteMga(id);
  }

  // Carriers
  @Get('carriers')
  @ApiOperation({ summary: 'List carriers (paginated)' })
  @ApiResponse({ status: 200, description: 'Carriers retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllCarriers(@Query() query: FindPartnersDto) {
    return this.service.findAllCarriers({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
    });
  }

  @Get('carriers/:id')
  @ApiOperation({ summary: 'Get carrier by id' })
  @ApiResponse({ status: 200, description: 'Carrier retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Carrier not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findCarrier(@Param('id') id: string) {
    return this.service.findCarrier(id);
  }

  @Post('carriers')
  @ApiOperation({ summary: 'Create carrier' })
  @ApiResponse({ status: 201, description: 'Carrier created successfully.' })
  @ApiResponse({ status: 409, description: 'Carrier name already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createCarrier(@Body() dto: CreateCarrierDto) {
    return this.service.createCarrier(dto);
  }

  @Put('carriers/:id')
  @ApiOperation({ summary: 'Update carrier' })
  @ApiResponse({ status: 200, description: 'Carrier updated successfully.' })
  @ApiResponse({ status: 404, description: 'Carrier not found.' })
  @ApiResponse({ status: 409, description: 'Carrier name already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateCarrier(@Param('id') id: string, @Body() dto: UpdateCarrierDto) {
    return this.service.updateCarrier(id, dto);
  }

  @Delete('carriers/:id')
  @ApiOperation({ summary: 'Soft delete carrier' })
  @ApiResponse({ status: 200, description: 'Carrier deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Carrier not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  deleteCarrier(@Param('id') id: string) {
    return this.service.deleteCarrier(id);
  }

  // MGA Carrier
  @Get('mga-carriers')
  @ApiOperation({ summary: 'List MGA-carrier relations (paginated + filters)' })
  @ApiResponse({ status: 200, description: 'MGA carrier relations retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findAllMgaCarriers(@Query() query: FindMgaCarriersDto) {
    return this.service.findAllMgaCarriers({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
      mgaId: query.mgaId,
      carrierId: query.carrierId,
      isActive: query.isActive !== undefined ? query.isActive === 'true' : undefined,
    });
  }

  @Get('mga-carriers/:id')
  @ApiOperation({ summary: 'Get MGA-carrier relation by id' })
  @ApiResponse({ status: 200, description: 'MGA carrier relation retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'MGA carrier relation not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  findMgaCarrier(@Param('id') id: string) {
    return this.service.findMgaCarrier(id);
  }

  @Post('mga-carriers')
  @ApiOperation({ summary: 'Create MGA-carrier relation' })
  @ApiResponse({ status: 201, description: 'MGA carrier relation created successfully.' })
  @ApiResponse({ status: 404, description: 'MGA or carrier not found.' })
  @ApiResponse({ status: 409, description: 'Relation already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  createMgaCarrier(@Body() dto: CreateMgaCarrierDto) {
    return this.service.createMgaCarrier(dto);
  }

  @Put('mga-carriers/:id')
  @ApiOperation({ summary: 'Update MGA-carrier relation' })
  @ApiResponse({ status: 200, description: 'MGA carrier relation updated successfully.' })
  @ApiResponse({ status: 404, description: 'MGA carrier relation not found.' })
  @ApiResponse({ status: 409, description: 'Relation already exists.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateMgaCarrier(@Param('id') id: string, @Body() dto: UpdateMgaCarrierDto) {
    return this.service.updateMgaCarrier(id, dto);
  }

  @Patch('mga-carriers/:id/activate')
  @ApiOperation({ summary: 'Activate MGA-carrier relation' })
  @ApiResponse({ status: 200, description: 'Relation activated successfully.' })
  @ApiResponse({ status: 404, description: 'MGA carrier relation not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  activateMgaCarrier(@Param('id') id: string) {
    return this.service.activateMgaCarrier(id);
  }

  @Patch('mga-carriers/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate MGA-carrier relation' })
  @ApiResponse({ status: 200, description: 'Relation deactivated successfully.' })
  @ApiResponse({ status: 404, description: 'MGA carrier relation not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  deactivateMgaCarrier(@Param('id') id: string) {
    return this.service.deactivateMgaCarrier(id);
  }

  @Delete('mga-carriers/:id')
  @ApiOperation({ summary: 'Soft delete MGA-carrier relation' })
  @ApiResponse({ status: 200, description: 'Relation deleted successfully.' })
  @ApiResponse({ status: 404, description: 'MGA carrier relation not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  deleteMgaCarrier(@Param('id') id: string) {
    return this.service.deleteMgaCarrier(id);
  }
}
