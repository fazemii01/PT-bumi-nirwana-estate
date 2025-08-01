"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const properties_service_1 = require("./properties.service");
describe('PropertiesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [properties_service_1.PropertiesService],
        }).compile();
        service = module.get(properties_service_1.PropertiesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=properties.service.spec.js.map