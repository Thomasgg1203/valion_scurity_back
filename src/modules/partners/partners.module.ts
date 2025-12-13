import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { AuditModule } from '../audit/audit.module';
import { MgaEntity } from 'src/infrastructure/database/entities/mga.entity';
import { CarrierEntity } from 'src/infrastructure/database/entities/carrier.entity';
import { MgaCarrierEntity } from 'src/infrastructure/database/entities/mga-carrier.entity';
import { MgaRepositoryImpl } from 'src/infrastructure/repositories/partners/mga.repository.impl';
import { CarrierRepositoryImpl } from 'src/infrastructure/repositories/partners/carrier.repository.impl';
import { MgaCarrierRepositoryImpl } from 'src/infrastructure/repositories/partners/mga-carrier.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([MgaEntity, CarrierEntity, MgaCarrierEntity]), AuditModule],
  controllers: [PartnersController],
  providers: [
    PartnersService,
    { provide: 'MgaRepository', useClass: MgaRepositoryImpl },
    { provide: 'CarrierRepository', useClass: CarrierRepositoryImpl },
    { provide: 'MgaCarrierRepository', useClass: MgaCarrierRepositoryImpl },
  ],
  exports: [PartnersService, TypeOrmModule],
})
export class PartnersModule {}
