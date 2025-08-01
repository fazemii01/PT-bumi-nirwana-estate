import { AuthDto } from '@/auths/dto/auth.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UsersService } from '@/users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthsService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signIn(authDto: AuthDto): Promise<{
        access_token: string;
    }>;
    signUp(createUserDto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
}
