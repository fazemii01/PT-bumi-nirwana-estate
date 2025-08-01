import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    create(createPropertyDto: CreatePropertyDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updatePropertyDto: UpdatePropertyDto): string;
    remove(id: string): string;
}
