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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthsController = void 0;
const common_1 = require("@nestjs/common");
const auths_service_1 = require("./auths.service");
const public_decorator_1 = require("@/auths/public.decorator");
const auth_dto_1 = require("@/auths/dto/auth.dto");
const create_user_dto_1 = require("@/users/dto/create-user.dto");
let AuthsController = class AuthsController {
    authsService;
    constructor(authsService) {
        this.authsService = authsService;
    }
    signIn(authDto) {
        return this.authsService.signIn(authDto);
    }
    signUp(createUser) {
        return this.authsService.signUp(createUser);
    }
};
exports.AuthsController = AuthsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto]),
    __metadata("design:returntype", void 0)
], AuthsController.prototype, "signIn", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], AuthsController.prototype, "signUp", null);
exports.AuthsController = AuthsController = __decorate([
    (0, common_1.Controller)('auths'),
    __metadata("design:paramtypes", [auths_service_1.AuthsService])
], AuthsController);
//# sourceMappingURL=auths.controller.js.map