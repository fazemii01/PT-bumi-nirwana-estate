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
exports.Property = exports.PriceUnit = exports.PropertyStatus = void 0;
const agent_entity_1 = require("@/agents/entities/agent.entity");
const developer_entity_1 = require("@/developers/entities/developer.entity");
const property_floor_plan_entity_1 = require("@/properties/entities/property-floor-plan.entity");
const property_image_entity_1 = require("@/properties/entities/property-image.entity");
const typeorm_1 = require("typeorm");
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["PRE_LAUNCH"] = "PRE_LAUNCH";
    PropertyStatus["AVAILABLE"] = "AVAILABLE";
    PropertyStatus["SOLD_OUT"] = "SOLD_OUT";
    PropertyStatus["RESERVED"] = "RESERVED";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
var PriceUnit;
(function (PriceUnit) {
    PriceUnit["TOTAL"] = "TOTAL";
    PriceUnit["PER_MONTH"] = "PER_MONTH";
    PriceUnit["PER_SQM"] = "PER_SQM";
})(PriceUnit || (exports.PriceUnit = PriceUnit = {}));
let Property = class Property {
    id;
    developer;
    agent;
    name;
    slug;
    status;
    price;
    price_unit;
    currency;
    description;
    location;
    address;
    specifications;
    images;
    floor_plans;
    created_at;
    updated_at;
};
exports.Property = Property;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Property.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => developer_entity_1.Developer, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", developer_entity_1.Developer)
], Property.prototype, "developer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => agent_entity_1.Agent, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", agent_entity_1.Agent)
], Property.prototype, "agent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: false }),
    __metadata("design:type", String)
], Property.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, unique: true, nullable: false }),
    __metadata("design:type", String)
], Property.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PropertyStatus,
        default: PropertyStatus.AVAILABLE,
    }),
    __metadata("design:type", String)
], Property.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 18, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Property.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PriceUnit,
        default: PriceUnit.TOTAL,
    }),
    __metadata("design:type", String)
], Property.prototype, "price_unit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 3, nullable: false, default: 'IDR' }),
    __metadata("design:type", String)
], Property.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Property.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", String)
], Property.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Property.prototype, "specifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_image_entity_1.PropertyImage, (image) => image.property),
    __metadata("design:type", Array)
], Property.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => property_floor_plan_entity_1.PropertyFloorPlan, (floorPlan) => floorPlan.property),
    __metadata("design:type", Array)
], Property.prototype, "floor_plans", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Property.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Property.prototype, "updated_at", void 0);
exports.Property = Property = __decorate([
    (0, typeorm_1.Entity)('properties')
], Property);
//# sourceMappingURL=property.entity.js.map