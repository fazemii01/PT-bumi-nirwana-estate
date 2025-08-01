import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertiesService {
    create(createPropertyDto: CreatePropertyDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updatePropertyDto: UpdatePropertyDto): string;
    remove(id: number): string;
}
