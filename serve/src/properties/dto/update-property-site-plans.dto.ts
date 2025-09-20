import { CreatePropertySitePlansDto } from '@/properties/dto/create-property-site-plans.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePropertyFloorPlansDto extends PartialType(
  CreatePropertySitePlansDto,
) {}
