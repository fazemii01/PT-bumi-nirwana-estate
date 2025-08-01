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
exports.DevelopersController = void 0;
const common_1 = require("@nestjs/common");
const developers_service_1 = require("./developers.service");
const create_developer_dto_1 = require("./dto/create-developer.dto");
const update_developer_dto_1 = require("./dto/update-developer.dto");
let DevelopersController = class DevelopersController {
    developersService;
    constructor(developersService) {
        this.developersService = developersService;
    }
    create(createDeveloperDto) {
        return this.developersService.create(createDeveloperDto);
    }
    findAll() {
        return this.developersService.findAll();
    }
    findOne(id) {
        return this.developersService.findOne(+id);
    }
    update(id, updateDeveloperDto) {
        return this.developersService.update(+id, updateDeveloperDto);
    }
    remove(id) {
        return this.developersService.remove(+id);
    }
};
exports.DevelopersController = DevelopersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_developer_dto_1.CreateDeveloperDto]),
    __metadata("design:returntype", void 0)
], DevelopersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DevelopersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevelopersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_developer_dto_1.UpdateDeveloperDto]),
    __metadata("design:returntype", void 0)
], DevelopersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DevelopersController.prototype, "remove", null);
exports.DevelopersController = DevelopersController = __decorate([
    (0, common_1.Controller)('developers'),
    __metadata("design:paramtypes", [developers_service_1.DevelopersService])
], DevelopersController);
//# sourceMappingURL=developers.controller.js.map