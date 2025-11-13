import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidelinesService } from './guidelines.service';
import { GuidelinesController } from './guidelines.controller';
import { PartnersModule } from '../partners/partners.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { AuditModule } from '../audit/audit.module';
import { GuidelineCategoryEntity } from 'src/infrastructure/database/entities/guideline_category.entity';
import { GuidelineFieldEntity } from 'src/infrastructure/database/entities/guideline-field.entity';
import { GuidelineRuleEntity } from 'src/infrastructure/database/entities/guideline-rule.entity';
import { StateRuleEntity } from 'src/infrastructure/database/entities/state-rule.entity';
import { AppetiteCommodityEntity } from 'src/infrastructure/database/entities/appetite-commodity.entity';
import { ExclusionEntity } from 'src/infrastructure/database/entities/exclusion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuidelineCategoryEntity,
      GuidelineFieldEntity,
      GuidelineRuleEntity,
      StateRuleEntity,
      AppetiteCommodityEntity,
      ExclusionEntity,
    ]),
    PartnersModule,
    CatalogsModule,
    AuditModule,
  ],
  controllers: [GuidelinesController],
  providers: [GuidelinesService],
  exports: [GuidelinesService, TypeOrmModule],
})
export class GuidelinesModule {}
