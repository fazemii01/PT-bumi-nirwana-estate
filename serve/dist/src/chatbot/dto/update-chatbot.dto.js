"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateChatbotDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_chatbot_dto_1 = require("./create-chatbot.dto");
class UpdateChatbotDto extends (0, mapped_types_1.PartialType)(create_chatbot_dto_1.CreateChatbotDto) {
}
exports.UpdateChatbotDto = UpdateChatbotDto;
//# sourceMappingURL=update-chatbot.dto.js.map