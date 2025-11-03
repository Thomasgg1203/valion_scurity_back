import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { State } from './entities/state.entity';
import { Commodity } from './entities/commodity.entity';
import { LineOfBusiness } from './entities/line-of-business.entity';
import { Coverage } from './entities/coverage.entity';
import { LimitUnit } from './entities/limit-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State, Commodity, LineOfBusiness, Coverage, LimitUnit])],
  controllers: [CatalogsController],
  providers: [CatalogsService],
  exports: [CatalogsService, TypeOrmModule],
})
export class CatalogsModule {}
