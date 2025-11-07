import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BaseModule } from './modules/base.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, BaseModule],
})
export class AppModule {}
