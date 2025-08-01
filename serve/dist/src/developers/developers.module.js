"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopersModule = void 0;
const common_1 = require("@nestjs/common");
const developers_service_1 = require("./developers.service");
const developers_controller_1 = require("./developers.controller");
const typeorm_1 = require("@nestjs/typeorm");
const developer_entity_1 = require("@/developers/entities/developer.entity");
let DevelopersModule = class DevelopersModule {
};
exports.DevelopersModule = DevelopersModule;
exports.DevelopersModule = DevelopersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([developer_entity_1.Developer])],
        controllers: [developers_controller_1.DevelopersController],
        providers: [developers_service_1.DevelopersService],
    })
], DevelopersModule);
//# sourceMappingURL=developers.module.js.map