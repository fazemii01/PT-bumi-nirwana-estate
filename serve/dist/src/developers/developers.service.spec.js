"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const developers_service_1 = require("./developers.service");
describe('DevelopersService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [developers_service_1.DevelopersService],
        }).compile();
        service = module.get(developers_service_1.DevelopersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=developers.service.spec.js.map