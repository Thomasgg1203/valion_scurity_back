import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { CreateCommodityDto } from './dto/create-commodity.dto';
import { UpdateCommodityDto } from './dto/update-commodity.dto';
import { CreateLineOfBusinessDto } from './dto/create-line-of-business.dto';
import { UpdateLineOfBusinessDto } from './dto/update-line-of-business.dto';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';
import { CreateLimitUnitDto } from './dto/create-limit-unit.dto';
import { UpdateLimitUnitDto } from './dto/update-limit-unit.dto';
import type { StateRepository } from '../../common/types/catalogs/state.repository';
import type { CommodityRepository } from 'src/common/types/catalogs/commodity.repository';
import type { LineOfBusinessRepository } from 'src/common/types/catalogs/line-of-business.repository';
import type { CoverageRepository } from 'src/common/types/catalogs/coverage.repository';
import type { LimitUnitRepository } from 'src/common/types/catalogs/limit-unit.repository';
import { FindOptions } from 'src/common/types/find-options';

@Injectable()
export class CatalogsService {
  constructor(
    @Inject('StateRepository')
    private readonly stateRepo: StateRepository,
    @Inject('CommodityRepository')
    private readonly commodityRepo: CommodityRepository,
    @Inject('LineOfBusinessRepository')
    private readonly lobRepo: LineOfBusinessRepository,
    @Inject('CoverageRepository')
    private readonly coverageRepo: CoverageRepository,
    @Inject('LimitUnitRepository')
    private readonly limitUnitRepo: LimitUnitRepository,
  ) {}

  createState(dto: CreateStateDto) {
    return this.stateRepo.create({
      code: dto.code,
      name: dto.name,
    });
  }

  async findAllStates(query: FindOptions) {
    const page = query.page;
    const limit = query.limit;
    const search = query.search ?? undefined;

    const { data, total } = await this.stateRepo.findAll({
      page,
      limit,
      search,
    });

    return {
      data,
      message: 'States successfully obtained',
      meta: this.buildMeta(total, page, limit),
    };
  }

  async findState(id: string) {
    const result = await this.stateRepo.findById(id);
    if (!result) throw new NotFoundException('State not found');
    return result;
  }

  updateState(id: string, dto: UpdateStateDto) {
    return this.stateRepo.update(id, dto);
  }

  deleteState(id: string) {
    return this.stateRepo.softDelete(id);
  }

  createCommodity(dto: CreateCommodityDto) {
    return this.commodityRepo.create({
      name: dto.name,
      description: dto.description,
    });
  }

  async findAllCommodities(query: FindOptions) {
    const { data, total } = await this.commodityRepo.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    return {
      data,
      message: 'Commodities successfully obtained',
      meta: this.buildMeta(total, query.page, query.limit),
    };
  }

  async findCommodity(id: string) {
    const result = await this.commodityRepo.findById(id);
    if (!result) throw new NotFoundException('Commodity not found');
    return result;
  }

  updateCommodity(id: string, dto: UpdateCommodityDto) {
    return this.commodityRepo.update(id, dto);
  }

  deleteCommodity(id: string) {
    return this.commodityRepo.softDelete(id);
  }

  createLineOfBusiness(dto: CreateLineOfBusinessDto) {
    return this.lobRepo.create({
      code: dto.code,
      name: dto.name,
    });
  }

  async findAllLinesOfBusiness(query: FindOptions) {
    const { data, total } = await this.lobRepo.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    return {
      data,
      message: 'Lines of business successfully obtained',
      meta: this.buildMeta(total, query.page, query.limit),
    };
  }

  async findLineOfBusiness(id: string) {
    const result = await this.lobRepo.findById(id);
    if (!result) throw new NotFoundException('Line of business not found');
    return result;
  }

  updateLineOfBusiness(id: string, dto: UpdateLineOfBusinessDto) {
    return this.lobRepo.update(id, dto);
  }

  deleteLineOfBusiness(id: string) {
    return this.lobRepo.softDelete(id);
  }

  createCoverage(dto: CreateCoverageDto) {
    return this.coverageRepo.create({
      code: dto.code,
      name: dto.name,
      description: dto.description,
      lineOfBusinessId: dto.lobId,
    });
  }

  async findAllCoverages(query: FindOptions) {
    const { data, total } = await this.coverageRepo.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      filters: query.filters,
    });

    return {
      data,
      message: 'Coverages successfully obtained',
      meta: this.buildMeta(total, query.page, query.limit),
    };
  }

  async findCoverage(id: string) {
    const result = await this.coverageRepo.findById(id);
    if (!result) throw new NotFoundException('Coverage not found');
    return result;
  }

  updateCoverage(id: string, dto: UpdateCoverageDto) {
    return this.coverageRepo.update(id, {
      code: dto.code,
      name: dto.name,
      description: dto.description,
      lineOfBusinessId: dto.lobId,
    });
  }

  deleteCoverage(id: string) {
    return this.coverageRepo.softDelete(id);
  }

  createLimitUnit(dto: CreateLimitUnitDto) {
    return this.limitUnitRepo.create({
      code: dto.code,
      name: dto.name,
    });
  }

  async findAllLimitUnits(query: FindOptions) {
    const { data, total } = await this.limitUnitRepo.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });

    return {
      data,
      message: 'Limit units successfully obtained',
      meta: this.buildMeta(total, query.page, query.limit),
    };
  }

  async findLimitUnit(id: string) {
    const result = await this.limitUnitRepo.findById(id);
    if (!result) throw new NotFoundException('Limit unit not found');
    return result;
  }

  updateLimitUnit(id: string, dto: UpdateLimitUnitDto) {
    return this.limitUnitRepo.update(id, dto);
  }

  deleteLimitUnit(id: string) {
    return this.limitUnitRepo.softDelete(id);
  }

  private buildMeta(total: number, page?: number, limit?: number) {
    const currentPage = page && page > 0 ? page : 1;
    const perPage = limit && limit > 0 ? limit : total;
    return {
      total,
      page: currentPage,
      perPage,
    };
  }
}
