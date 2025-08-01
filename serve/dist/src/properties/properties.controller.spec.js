"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const properties_controller_1 = require("./properties.controller");
const properties_service_1 = require("./properties.service");
describe('PropertiesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [properties_controller_1.PropertiesController],
            providers: [properties_service_1.PropertiesService],
        }).compile();
        controller = module.get(properties_controller_1.PropertiesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=properties.controller.spec.js.map