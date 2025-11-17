import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import type { StateRepository } from '../../common/types/catalogs/state.repository';
import { FindOptions } from 'src/common/types/find-options';

@Injectable()
export class CatalogsService {
  constructor(
    @Inject('StateRepository')
    private readonly stateRepo: StateRepository,
  ) {}

  createState(dto: CreateStateDto) {
    return this.stateRepo.create({
      code: dto.code,
      name: dto.name,
    });
  }

  async findAllStates(query: FindOptions) {
    const skip = query.skip && query.take ? (query.skip - 1) * query.take : undefined;
    const take = query.take ?? undefined;
    const search = query.search ?? undefined;

    const { data, total } = await this.stateRepo.findAll({
      skip,
      take,
      search,
    });

    return {
      data,
      message: 'States successfully obtained',
      meta: {
        total,
        page: query.skip ?? 1,
        perPage: query.take ?? total,
      },
    };
  }

  async findState(id: string) {
    const result = await this.stateRepo.findById(id);
    if (!result) throw new NotFoundException('State not found');
    return result;
  }

  deleteState(id: string) {
    return this.stateRepo.softDelete(id);
  }
}
