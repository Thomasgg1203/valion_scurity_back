import { Module } from '@nestjs/common';
import { CatalogsModule } from './catalogs/catalogs.module';
import { PartnersModule } from './partners/partners.module';
import { GuidelinesModule } from './guidelines/guidelines.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { IamModule } from './iam/iam.module';

@Module({
  imports: [CatalogsModule, PartnersModule, GuidelinesModule, AuditModule, AuthModule, IamModule],
})
export class BaseModule {}
