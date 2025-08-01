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
exports.UserFavoritesController = void 0;
const common_1 = require("@nestjs/common");
const user_favorites_service_1 = require("./user-favorites.service");
const create_user_favorite_dto_1 = require("./dto/create-user-favorite.dto");
const update_user_favorite_dto_1 = require("./dto/update-user-favorite.dto");
let UserFavoritesController = class UserFavoritesController {
    userFavoritesService;
    constructor(userFavoritesService) {
        this.userFavoritesService = userFavoritesService;
    }
    create(createUserFavoriteDto) {
        return this.userFavoritesService.create(createUserFavoriteDto);
    }
    findAll() {
        return this.userFavoritesService.findAll();
    }
    findOne(id) {
        return this.userFavoritesService.findOne(+id);
    }
    update(id, updateUserFavoriteDto) {
        return this.userFavoritesService.update(+id, updateUserFavoriteDto);
    }
    remove(id) {
        return this.userFavoritesService.remove(+id);
    }
};
exports.UserFavoritesController = UserFavoritesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_favorite_dto_1.CreateUserFavoriteDto]),
    __metadata("design:returntype", void 0)
], UserFavoritesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserFavoritesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserFavoritesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_favorite_dto_1.UpdateUserFavoriteDto]),
    __metadata("design:returntype", void 0)
], UserFavoritesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserFavoritesController.prototype, "remove", null);
exports.UserFavoritesController = UserFavoritesController = __decorate([
    (0, common_1.Controller)('user-favorites'),
    __metadata("design:paramtypes", [user_favorites_service_1.UserFavoritesService])
], UserFavoritesController);
//# sourceMappingURL=user-favorites.controller.js.map