import { CreateSearchDto } from './dto/create-search.dto';
import { UpdateSearchDto } from './dto/update-search.dto';
export declare class SearchService {
    create(createSearchDto: CreateSearchDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSearchDto: UpdateSearchDto): string;
    remove(id: number): string;
}
