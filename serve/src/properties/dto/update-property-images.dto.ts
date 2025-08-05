import { CreatePropertyImageDto } from '@/properties/dto/create-property-image.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePropertyImagesDto extends PartialType(
  CreatePropertyImageDto,
) {}
