import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
export declare class DevelopersController {
    private readonly developersService;
    constructor(developersService: DevelopersService);
    create(createDeveloperDto: CreateDeveloperDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDeveloperDto: UpdateDeveloperDto): string;
    remove(id: string): string;
}
