import { Module } from '@nestjs/common';
import { BaseModule } from './modules/base.module';

@Module({
  imports: [BaseModule],
})
export class AppModule {}
