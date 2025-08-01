"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const agents_service_1 = require("./agents.service");
describe('AgentsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [agents_service_1.AgentsService],
        }).compile();
        service = module.get(agents_service_1.AgentsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=agents.service.spec.js.map