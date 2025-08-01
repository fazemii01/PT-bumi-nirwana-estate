"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chatbot_service_1 = require("./chatbot.service");
describe('ChatbotService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [chatbot_service_1.ChatbotService],
        }).compile();
        service = module.get(chatbot_service_1.ChatbotService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=chatbot.service.spec.js.map