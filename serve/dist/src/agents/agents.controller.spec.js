"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const agents_controller_1 = require("./agents.controller");
const agents_service_1 = require("./agents.service");
describe('AgentsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [agents_controller_1.AgentsController],
            providers: [agents_service_1.AgentsService],
        }).compile();
        controller = module.get(agents_controller_1.AgentsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=agents.controller.spec.js.map