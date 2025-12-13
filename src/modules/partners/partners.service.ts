import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindPartnersOptions, FindMgaCarrierOptions } from 'src/common/types/partners/find-options';
import type { MgaRepository } from 'src/common/types/partners/mga.repository';
import type { CarrierRepository } from 'src/common/types/partners/carrier.repository';
import type { MgaCarrierRepository } from 'src/common/types/partners/mga-carrier.repository';
import { CreateMgaDto } from './dto/create-mga.dto';
import { UpdateMgaDto } from './dto/update-mga.dto';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { CreateMgaCarrierDto } from './dto/create-mga-carrier.dto';
import { UpdateMgaCarrierDto } from './dto/update-mga-carrier.dto';
import { Mga } from 'src/core/models/mga.model';
import { Carrier } from 'src/core/models/carrier.model';
import { MgaCarrier } from 'src/core/models/mga-carrier.model';

@Injectable()
export class PartnersService {
  constructor(
    @Inject('MgaRepository')
    private readonly mgaRepo: MgaRepository,
    @Inject('CarrierRepository')
    private readonly carrierRepo: CarrierRepository,
    @Inject('MgaCarrierRepository')
    private readonly mgaCarrierRepo: MgaCarrierRepository,
  ) {}

  // MGA
  async createMga(dto: CreateMgaDto): Promise<Mga> {
    return this.mgaRepo.create(dto);
  }

  async findAllMgas(options: FindPartnersOptions) {
    const page = options.page;
    const limit = options.limit;
    const { data, total } = await this.mgaRepo.findAll({ page, limit, search: options.search });
    return {
      data,
      meta: this.buildMeta(total, page, limit),
    };
  }

  async findMga(id: string): Promise<Mga> {
    const mga = await this.mgaRepo.findById(id);
    if (!mga) throw new NotFoundException('MGA not found');
    return mga;
  }

  async updateMga(id: string, dto: UpdateMgaDto): Promise<Mga> {
    const updated = await this.mgaRepo.update(id, dto);
    await this.mgaCarrierRepo.updateConcatForMga(updated.id, updated.name);
    return updated;
  }

  async deleteMga(id: string): Promise<void> {
    await this.mgaRepo.softDelete(id);
  }

  // Carrier
  async createCarrier(dto: CreateCarrierDto): Promise<Carrier> {
    return this.carrierRepo.create(dto);
  }

  async findAllCarriers(options: FindPartnersOptions) {
    const page = options.page;
    const limit = options.limit;
    const { data, total } = await this.carrierRepo.findAll({
      page,
      limit,
      search: options.search,
    });
    return {
      data,
      meta: this.buildMeta(total, page, limit),
    };
  }

  async findCarrier(id: string): Promise<Carrier> {
    const carrier = await this.carrierRepo.findById(id);
    if (!carrier) throw new NotFoundException('Carrier not found');
    return carrier;
  }

  async updateCarrier(id: string, dto: UpdateCarrierDto): Promise<Carrier> {
    const updated = await this.carrierRepo.update(id, dto);
    await this.mgaCarrierRepo.updateConcatForCarrier(updated.id, updated.name);
    return updated;
  }

  async deleteCarrier(id: string): Promise<void> {
    await this.carrierRepo.softDelete(id);
  }

  // MGA Carrier relations
  async createMgaCarrier(dto: CreateMgaCarrierDto): Promise<MgaCarrier> {
    const mga = await this.mgaRepo.findById(dto.mgaId);
    if (!mga) throw new NotFoundException('MGA not found');
    const carrier = await this.carrierRepo.findById(dto.carrierId);
    if (!carrier) throw new NotFoundException('Carrier not found');

    const concatName = `${mga.name} / ${carrier.name}`;

    return this.mgaCarrierRepo.create({
      mgaId: dto.mgaId,
      carrierId: dto.carrierId,
      concatName,
      isActive: true,
      appetiteNotes: dto.appetiteNotes,
      createdBy: dto.createdBy,
    });
  }

  async findAllMgaCarriers(options: FindMgaCarrierOptions) {
    const page = options.page;
    const limit = options.limit;
    const { data, total } = await this.mgaCarrierRepo.findAll({
      page,
      limit,
      search: options.search,
      mgaId: options.mgaId,
      carrierId: options.carrierId,
      isActive: options.isActive,
    });

    return {
      data,
      meta: this.buildMeta(total, page, limit),
    };
  }

  async findMgaCarrier(id: string): Promise<MgaCarrier> {
    const relation = await this.mgaCarrierRepo.findById(id);
    if (!relation) throw new NotFoundException('MGA carrier relation not found');
    return relation;
  }

  async updateMgaCarrier(id: string, dto: UpdateMgaCarrierDto): Promise<MgaCarrier> {
    return this.mgaCarrierRepo.update(id, {
      appetiteNotes: dto.appetiteNotes,
      updatedBy: dto.updatedBy,
      isActive: dto.isActive,
    });
  }

  async activateMgaCarrier(id: string): Promise<MgaCarrier> {
    return this.mgaCarrierRepo.update(id, { isActive: true });
  }

  async deactivateMgaCarrier(id: string): Promise<MgaCarrier> {
    return this.mgaCarrierRepo.update(id, { isActive: false });
  }

  async deleteMgaCarrier(id: string): Promise<void> {
    await this.mgaCarrierRepo.softDelete(id);
  }

  private buildMeta(total: number, page?: number, limit?: number) {
    const currentPage = page && page > 0 ? page : 1;
    const perPage = limit && limit > 0 ? limit : 10;
    return {
      total,
      page: currentPage,
      limit: perPage,
    };
  }
}
