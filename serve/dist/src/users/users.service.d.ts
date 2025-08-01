import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@/users/entities/user.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private readonly usersRepositoty;
    constructor(usersRepositoty: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): string;
    findOne(id: number): string;
    findOneByEmail(email: string): Promise<User | null>;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
