import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { StateEntity } from '../../infrastructure/database/entities/state.entity';
import { CommodityEntity } from '../../infrastructure/database/entities/commodity.entity';
import { LineOfBusinessEntity } from '../../infrastructure/database/entities/line-of-business.entity';
import { CoverageEntity } from '../../infrastructure/database/entities/coverage.entity';
import { LimitUnitEntity } from '../../infrastructure/database/entities/limit-unit.entity';
import { StateRepositoryImpl } from 'src/infrastructure/repositories/catalogs/state.repository.impl';
import { CommodityRepositoryImpl } from 'src/infrastructure/repositories/catalogs/commodity.repository.impl';
import { LineOfBusinessRepositoryImpl } from 'src/infrastructure/repositories/catalogs/line-of-business.repository.impl';
import { CoverageRepositoryImpl } from 'src/infrastructure/repositories/catalogs/coverage.repository.impl';
import { LimitUnitRepositoryImpl } from 'src/infrastructure/repositories/catalogs/limit-unit.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StateEntity,
      CommodityEntity,
      LineOfBusinessEntity,
      CoverageEntity,
      LimitUnitEntity,
    ]),
  ],
  controllers: [CatalogsController],
  providers: [
    CatalogsService,
    { provide: 'StateRepository', useClass: StateRepositoryImpl },
    { provide: 'CommodityRepository', useClass: CommodityRepositoryImpl },
    { provide: 'LineOfBusinessRepository', useClass: LineOfBusinessRepositoryImpl },
    { provide: 'CoverageRepository', useClass: CoverageRepositoryImpl },
    { provide: 'LimitUnitRepository', useClass: LimitUnitRepositoryImpl },
  ],
  exports: [CatalogsService, TypeOrmModule],
})
export class CatalogsModule {}
