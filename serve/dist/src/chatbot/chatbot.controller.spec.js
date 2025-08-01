"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chatbot_controller_1 = require("./chatbot.controller");
const chatbot_service_1 = require("./chatbot.service");
describe('ChatbotController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [chatbot_controller_1.ChatbotController],
            providers: [chatbot_service_1.ChatbotService],
        }).compile();
        controller = module.get(chatbot_controller_1.ChatbotController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=chatbot.controller.spec.js.map