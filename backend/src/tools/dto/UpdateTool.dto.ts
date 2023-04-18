import { PartialType } from '@nestjs/swagger';
import { CreateToolDto } from './CreateTool.dto';

export class UpdateToolDto extends PartialType(CreateToolDto) {}
