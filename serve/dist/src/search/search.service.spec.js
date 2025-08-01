"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const search_service_1 = require("./search.service");
describe('SearchService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [search_service_1.SearchService],
        }).compile();
        service = module.get(search_service_1.SearchService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=search.service.spec.js.map