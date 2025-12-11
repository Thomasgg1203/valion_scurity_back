import { Controller, Post, Body, Get, Param, Delete, Query, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CatalogsService } from './catalogs.service';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { FindOptionsDto } from './dto/find-options.dto';
import { CreateCommodityDto } from './dto/create-commodity.dto';
import { UpdateCommodityDto } from './dto/update-commodity.dto';
import { CreateLineOfBusinessDto } from './dto/create-line-of-business.dto';
import { UpdateLineOfBusinessDto } from './dto/update-line-of-business.dto';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { FindCoverageDto } from './dto/find-coverage.dto';
import { CreateLimitUnitDto } from './dto/create-limit-unit.dto';
import { UpdateLimitUnitDto } from './dto/update-limit-unit.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Catalogs')
@ApiBearerAuth()
@Controller('catalogs')
@UseGuards(JwtAuthGuard)
export class CatalogsController {
  constructor(private readonly service: CatalogsService) {}

  @Post('state')
  @ApiOperation({
    summary: 'Create a new State',
    description: 'Creates a new state entry in the catalog.',
  })
  @ApiResponse({ status: 201, description: 'State created successfully.' })
  create(@Body() dto: CreateStateDto) {
    return this.service.createState(dto);
  }

  @Get('state')
  @ApiOperation({
    summary: 'Get all states (paginated)',
    description: 'Returns a paginated list of states with support for pagination and search.',
  })
  @ApiResponse({ status: 200, description: 'List of states retrieved successfully.' })
  findAll(@Query() query: FindOptionsDto) {
    return this.service.findAllStates({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
    });
  }

  @Get('state/:id')
  @ApiOperation({
    summary: 'Get a state by ID',
    description: 'Fetch a state using its UUID identifier.',
  })
  @ApiResponse({ status: 200, description: 'State retrieved successfully.' })
  findOne(@Param('id') id: string) {
    return this.service.findState(id);
  }

  @Put('state/:id')
  @ApiOperation({
    summary: 'Update a state',
    description: 'Updates a state entry by its ID.',
  })
  @ApiResponse({ status: 200, description: 'State updated successfully.' })
  update(@Param('id') id: string, @Body() dto: UpdateStateDto) {
    return this.service.updateState(id, dto);
  }

  @Delete('state/:id')
  @ApiOperation({
    summary: 'Soft delete a state',
    description: 'Soft delete a state by marking its "deleted_at" field.',
  })
  @ApiResponse({ status: 200, description: 'State deleted successfully.' })
  delete(@Param('id') id: string) {
    return this.service.deleteState(id);
  }

  @Post('commodity')
  @ApiOperation({ summary: 'Create a new commodity' })
  @ApiResponse({ status: 201, description: 'Commodity created successfully.' })
  createCommodity(@Body() dto: CreateCommodityDto) {
    return this.service.createCommodity(dto);
  }

  @Get('commodity')
  @ApiOperation({ summary: 'List all commodities (paginated)' })
  @ApiResponse({ status: 200, description: 'List of commodities retrieved successfully.' })
  findAllCommodities(@Query() query: FindOptionsDto) {
    return this.service.findAllCommodities({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
    });
  }

  @Get('commodity/:id')
  @ApiOperation({ summary: 'Get a commodity by ID' })
  @ApiResponse({ status: 200, description: 'Commodity retrieved successfully.' })
  findCommodity(@Param('id') id: string) {
    return this.service.findCommodity(id);
  }

  @Put('commodity/:id')
  @ApiOperation({ summary: 'Update a commodity' })
  @ApiResponse({ status: 200, description: 'Commodity updated successfully.' })
  updateCommodity(@Param('id') id: string, @Body() dto: UpdateCommodityDto) {
    return this.service.updateCommodity(id, dto);
  }

  @Delete('commodity/:id')
  @ApiOperation({ summary: 'Soft delete a commodity' })
  @ApiResponse({ status: 200, description: 'Commodity deleted successfully.' })
  deleteCommodity(@Param('id') id: string) {
    return this.service.deleteCommodity(id);
  }

  @Post('line-of-business')
  @ApiOperation({ summary: 'Create a new line of business' })
  @ApiResponse({ status: 201, description: 'Line of business created successfully.' })
  createLineOfBusiness(@Body() dto: CreateLineOfBusinessDto) {
    return this.service.createLineOfBusiness(dto);
  }

  @Get('line-of-business')
  @ApiOperation({ summary: 'List all lines of business (paginated)' })
  @ApiResponse({ status: 200, description: 'List of lines of business retrieved successfully.' })
  findAllLinesOfBusiness(@Query() query: FindOptionsDto) {
    return this.service.findAllLinesOfBusiness({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
    });
  }

  @Get('line-of-business/:id')
  @ApiOperation({ summary: 'Get a line of business by ID' })
  @ApiResponse({ status: 200, description: 'Line of business retrieved successfully.' })
  findLineOfBusiness(@Param('id') id: string) {
    return this.service.findLineOfBusiness(id);
  }

  @Put('line-of-business/:id')
  @ApiOperation({ summary: 'Update a line of business' })
  @ApiResponse({ status: 200, description: 'Line of business updated successfully.' })
  updateLineOfBusiness(@Param('id') id: string, @Body() dto: UpdateLineOfBusinessDto) {
    return this.service.updateLineOfBusiness(id, dto);
  }

  @Delete('line-of-business/:id')
  @ApiOperation({ summary: 'Soft delete a line of business' })
  @ApiResponse({ status: 200, description: 'Line of business deleted successfully.' })
  deleteLineOfBusiness(@Param('id') id: string) {
    return this.service.deleteLineOfBusiness(id);
  }

  @Post('coverage')
  @ApiOperation({ summary: 'Create a new coverage' })
  @ApiResponse({ status: 201, description: 'Coverage created successfully.' })
  createCoverage(@Body() dto: CreateCoverageDto) {
    return this.service.createCoverage(dto);
  }

  @Get('coverage')
  @ApiOperation({ summary: 'List all coverages (paginated and filterable)' })
  @ApiResponse({ status: 200, description: 'List of coverages retrieved successfully.' })
  findAllCoverages(@Query() query: FindCoverageDto) {
    return this.service.findAllCoverages({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
      filters: { ...(query.lobId ? { lobId: query.lobId } : {}) },
    });
  }

  @Get('coverage/:id')
  @ApiOperation({ summary: 'Get a coverage by ID' })
  @ApiResponse({ status: 200, description: 'Coverage retrieved successfully.' })
  findCoverage(@Param('id') id: string) {
    return this.service.findCoverage(id);
  }

  @Put('coverage/:id')
  @ApiOperation({ summary: 'Update a coverage' })
  @ApiResponse({ status: 200, description: 'Coverage updated successfully.' })
  updateCoverage(@Param('id') id: string, @Body() dto: UpdateCoverageDto) {
    return this.service.updateCoverage(id, dto);
  }

  @Delete('coverage/:id')
  @ApiOperation({ summary: 'Soft delete a coverage' })
  @ApiResponse({ status: 200, description: 'Coverage deleted successfully.' })
  deleteCoverage(@Param('id') id: string) {
    return this.service.deleteCoverage(id);
  }

  @Post('limit-unit')
  @ApiOperation({ summary: 'Create a new limit unit' })
  @ApiResponse({ status: 201, description: 'Limit unit created successfully.' })
  createLimitUnit(@Body() dto: CreateLimitUnitDto) {
    return this.service.createLimitUnit(dto);
  }

  @Get('limit-unit')
  @ApiOperation({ summary: 'List all limit units (paginated)' })
  @ApiResponse({ status: 200, description: 'List of limit units retrieved successfully.' })
  findAllLimitUnits(@Query() query: FindOptionsDto) {
    return this.service.findAllLimitUnits({
      page: query.page ? Number(query.page) : undefined,
      limit: query.limit ? Number(query.limit) : undefined,
      search: query.search,
    });
  }

  @Get('limit-unit/:id')
  @ApiOperation({ summary: 'Get a limit unit by ID' })
  @ApiResponse({ status: 200, description: 'Limit unit retrieved successfully.' })
  findLimitUnit(@Param('id') id: string) {
    return this.service.findLimitUnit(id);
  }

  @Put('limit-unit/:id')
  @ApiOperation({ summary: 'Update a limit unit' })
  @ApiResponse({ status: 200, description: 'Limit unit updated successfully.' })
  updateLimitUnit(@Param('id') id: string, @Body() dto: UpdateLimitUnitDto) {
    return this.service.updateLimitUnit(id, dto);
  }

  @Delete('limit-unit/:id')
  @ApiOperation({ summary: 'Soft delete a limit unit' })
  @ApiResponse({ status: 200, description: 'Limit unit deleted successfully.' })
  deleteLimitUnit(@Param('id') id: string) {
    return this.service.deleteLimitUnit(id);
  }
}
