import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { AuditModule } from '../audit/audit.module';
import { MgaEntity } from 'src/infrastructure/database/entities/mga.entity';
import { CarrierEntity } from 'src/infrastructure/database/entities/carrier.entity';
import { MgaCarrierEntity } from 'src/infrastructure/database/entities/mga-carrier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MgaEntity, CarrierEntity, MgaCarrierEntity]),
    AuditModule, // 🔍 Allows you to record actions in this module
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService, TypeOrmModule],
})
export class PartnersModule {}
