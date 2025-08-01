import { SearchService } from './search.service';
import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    create(createSearchDto: CreateSearchDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSearchDto: UpdateSearchDto): string;
    remove(id: string): string;
}
