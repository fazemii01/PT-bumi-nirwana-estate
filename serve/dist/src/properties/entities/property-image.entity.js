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
exports.PropertyImage = void 0;
const property_entity_1 = require("@/properties/entities/property.entity");
const typeorm_1 = require("typeorm");
let PropertyImage = class PropertyImage {
    id;
    property;
    image_url;
    caption;
    sort_order;
};
exports.PropertyImage = PropertyImage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PropertyImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_entity_1.Property, (property) => property.images, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", property_entity_1.Property)
], PropertyImage.prototype, "property", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: false }),
    __metadata("design:type", String)
], PropertyImage.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], PropertyImage.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PropertyImage.prototype, "sort_order", void 0);
exports.PropertyImage = PropertyImage = __decorate([
    (0, typeorm_1.Entity)('property_images')
], PropertyImage);
//# sourceMappingURL=property-image.entity.js.map