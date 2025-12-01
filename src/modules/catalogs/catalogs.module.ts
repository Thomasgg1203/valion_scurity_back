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
  providers: [CatalogsService, { provide: 'StateRepository', useClass: StateRepositoryImpl }],
  exports: [CatalogsService, TypeOrmModule],
})
export class CatalogsModule {}
