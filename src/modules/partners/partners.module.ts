import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { Mga } from './entities/mga.entity';
import { Carrier } from './entities/carrier.entity';
import { MgaCarrier } from './entities/mga-carrier.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mga, Carrier, MgaCarrier]),
    AuditModule, // 🔍 permite registrar acciones en este módulo
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService, TypeOrmModule],
})
export class PartnersModule {}
