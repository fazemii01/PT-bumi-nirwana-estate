import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
export declare class DevelopersService {
    create(createDeveloperDto: CreateDeveloperDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDeveloperDto: UpdateDeveloperDto): string;
    remove(id: number): string;
}
