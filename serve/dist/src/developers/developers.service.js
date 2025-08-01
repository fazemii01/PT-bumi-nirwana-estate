"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevelopersService = void 0;
const common_1 = require("@nestjs/common");
let DevelopersService = class DevelopersService {
    create(createDeveloperDto) {
        return 'This action adds a new developer';
    }
    findAll() {
        return `This action returns all developers`;
    }
    findOne(id) {
        return `This action returns a #${id} developer`;
    }
    update(id, updateDeveloperDto) {
        return `This action updates a #${id} developer`;
    }
    remove(id) {
        return `This action removes a #${id} developer`;
    }
};
exports.DevelopersService = DevelopersService;
exports.DevelopersService = DevelopersService = __decorate([
    (0, common_1.Injectable)()
], DevelopersService);
//# sourceMappingURL=developers.service.js.map