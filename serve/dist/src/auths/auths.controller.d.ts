import { AuthsService } from './auths.service';
import { AuthDto } from '@/auths/dto/auth.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
export declare class AuthsController {
    private readonly authsService;
    constructor(authsService: AuthsService);
    signIn(authDto: AuthDto): Promise<{
        access_token: string;
    }>;
    signUp(createUser: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
}
