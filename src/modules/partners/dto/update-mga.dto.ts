import { PartialType } from '@nestjs/swagger';
import { CreateMgaDto } from './create-mga.dto';

export class UpdateMgaDto extends PartialType(CreateMgaDto) {}
