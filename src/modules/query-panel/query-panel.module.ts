// src/modules/query-panel/query-panel.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QueryPanelController } from './query-panel.controller';
import { QueryPanelService } from './query-panel.service';

import { StateEntity } from 'src/infrastructure/database/entities/state.entity';
import { CommodityEntity } from 'src/infrastructure/database/entities/commodity.entity';
import { LineOfBusinessEntity } from 'src/infrastructure/database/entities/line-of-business.entity';
import { CoverageEntity } from 'src/infrastructure/database/entities/coverage.entity';
import { LimitUnitEntity } from 'src/infrastructure/database/entities/limit-unit.entity';
import { MgaCarrierEntity } from 'src/infrastructure/database/entities/mga-carrier.entity';
import { GuidelineCategoryEntity } from 'src/infrastructure/database/entities/guideline_category.entity';
import { GuidelineFieldEntity } from 'src/infrastructure/database/entities/guideline-field.entity';
import { AppetiteCommodityEntity } from 'src/infrastructure/database/entities/appetite-commodity.entity';
import { QueryPresetEntity } from 'src/infrastructure/database/entities/query-preset.entity';
import { ExclusionEntity } from 'src/infrastructure/database/entities/exclusion.entity';
import { GuidelineRuleEntity } from 'src/infrastructure/database/entities/guideline-rule.entity';
import { StateRuleEntity } from 'src/infrastructure/database/entities/state-rule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StateEntity,
      CommodityEntity,
      LineOfBusinessEntity,
      CoverageEntity,
      LimitUnitEntity,
      MgaCarrierEntity,
      GuidelineCategoryEntity,
      GuidelineFieldEntity,
      GuidelineRuleEntity,
      StateRuleEntity,
      ExclusionEntity,
      AppetiteCommodityEntity,
      QueryPresetEntity,
    ]),
  ],
  controllers: [QueryPanelController],
  providers: [QueryPanelService],
  exports: [QueryPanelService],
})
export class QueryPanelModule {}
