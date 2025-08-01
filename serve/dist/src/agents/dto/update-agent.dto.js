"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAgentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_agent_dto_1 = require("./create-agent.dto");
class UpdateAgentDto extends (0, mapped_types_1.PartialType)(create_agent_dto_1.CreateAgentDto) {
}
exports.UpdateAgentDto = UpdateAgentDto;
//# sourceMappingURL=update-agent.dto.js.map