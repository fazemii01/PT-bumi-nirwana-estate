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
exports.UserFavorite = void 0;
const property_entity_1 = require("@/properties/entities/property.entity");
const user_entity_1 = require("@/users/entities/user.entity");
const typeorm_1 = require("typeorm");
let UserFavorite = class UserFavorite {
    userId;
    propertyId;
    user;
    property;
    created_at;
};
exports.UserFavorite = UserFavorite;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], UserFavorite.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], UserFavorite.prototype, "propertyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.favorites, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], UserFavorite.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, { onDelete: 'CASCADE' }),
    __metadata("design:type", property_entity_1.Property)
], UserFavorite.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], UserFavorite.prototype, "created_at", void 0);
exports.UserFavorite = UserFavorite = __decorate([
    (0, typeorm_1.Entity)('user_favorites')
], UserFavorite);
//# sourceMappingURL=user-favorite.entity.js.map