import { Module } from '@nestjs/common';
import { CatalogsModule } from './catalogs/catalogs.module';
import { PartnersModule } from './partners/partners.module';
import { GuidelinesModule } from './guidelines/guidelines.module';
import { AuditModule } from './audit/audit.module';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ClientsModule,
    CatalogsModule,
    PartnersModule,
    GuidelinesModule,
    AuditModule,
    AuthModule,
  ],
})
export class BaseModule {}
