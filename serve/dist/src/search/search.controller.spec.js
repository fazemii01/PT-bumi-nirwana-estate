"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const search_controller_1 = require("./search.controller");
const search_service_1 = require("./search.service");
describe('SearchController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [search_controller_1.SearchController],
            providers: [search_service_1.SearchService],
        }).compile();
        controller = module.get(search_controller_1.SearchController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=search.controller.spec.js.map