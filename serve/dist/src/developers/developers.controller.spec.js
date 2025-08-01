"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const developers_controller_1 = require("./developers.controller");
const developers_service_1 = require("./developers.service");
describe('DevelopersController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [developers_controller_1.DevelopersController],
            providers: [developers_service_1.DevelopersService],
        }).compile();
        controller = module.get(developers_controller_1.DevelopersController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=developers.controller.spec.js.map