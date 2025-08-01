"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthsService = void 0;
const users_service_1 = require("@/users/users.service");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
let AuthsService = class AuthsService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async signIn(authDto) {
        const user = await this.usersService.findOneByEmail(authDto.email);
        if (!user ||
            !(await bcrypt.compare(authDto.password_hash, user.password_hash))) {
            throw new common_1.UnauthorizedException(`Invalid credential`);
        }
        const payload = {
            sub: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async signUp(createUserDto) {
        return this.usersService.create(createUserDto);
    }
};
exports.AuthsService = AuthsService;
exports.AuthsService = AuthsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthsService);
//# sourceMappingURL=auths.service.js.map