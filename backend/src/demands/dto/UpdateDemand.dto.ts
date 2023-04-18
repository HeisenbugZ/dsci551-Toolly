import { PartialType } from '@nestjs/swagger';
import { CreateDemandDto } from './CreateDemand.dto';

export class UpdateDemandDto extends PartialType(CreateDemandDto) {}
