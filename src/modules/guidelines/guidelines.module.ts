import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuidelinesService } from './guidelines.service';
import { GuidelinesController } from './guidelines.controller';
import { GuidelineCategory } from './entities/guideline_category.entity';
import { GuidelineField } from './entities/guideline-field.entity';
import { GuidelineRule } from './entities/guideline-rule.entity';
import { StateRule } from './entities/state-rule.entity';
import { AppetiteCommodity } from './entities/appetite-commodity.entity';
import { Exclusion } from './entities/exclusion.entity';
import { PartnersModule } from '../partners/partners.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GuidelineCategory,
      GuidelineField,
      GuidelineRule,
      StateRule,
      AppetiteCommodity,
      Exclusion,
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
