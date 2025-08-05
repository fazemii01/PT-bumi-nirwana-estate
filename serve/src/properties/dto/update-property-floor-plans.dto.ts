import { CreatePropertyFloorPlansDto } from '@/properties/dto/create-property-floor-plans.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePropertyFloorPlansDto extends PartialType(
  CreatePropertyFloorPlansDto,
) {}
