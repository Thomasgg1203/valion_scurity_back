import { Controller, Post, Body, Get, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CreateStateDto } from './dto/create-state.dto';
import { FindOptionsDto } from './dto/find-options.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Catalogs')
@Controller('catalogs')
@UseGuards(JwtAuthGuard)
export class CatalogsController {
  constructor(private readonly service: CatalogsService) {}

  @Post('state')
  @ApiOperation({
    summary: 'Create a new State',
    description: 'Creates a new state entry in the catalog.',
  })
  create(@Body() dto: CreateStateDto) {
    return this.service.createState(dto);
  }

  @Get('state')
  @ApiOperation({
    summary: 'Get all states (paginated)',
    description: 'Returns a paginated list of states with support for skip, take and search.',
  })
  findAll(@Query() query: FindOptionsDto) {
    return this.service.findAllStates({
      skip: query.skip ? Number(query.skip) : undefined,
      take: query.take ? Number(query.take) : undefined,
      search: query.search,
    });
  }

  @Get('state/:id')
  @ApiOperation({
    summary: 'Get a state by ID',
    description: 'Fetch a state using its UUID identifier.',
  })
  findOne(@Param('id') id: string) {
    return this.service.findState(id);
  }

  @Delete('state/:id')
  @ApiOperation({
    summary: 'Soft delete a state',
    description: 'Soft delete a state by marking its "deleted_at" field.',
  })
  delete(@Param('id') id: string) {
    return this.service.deleteState(id);
  }
}
