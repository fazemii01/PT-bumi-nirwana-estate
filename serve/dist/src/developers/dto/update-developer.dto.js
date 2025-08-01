"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeveloperDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_developer_dto_1 = require("./create-developer.dto");
class UpdateDeveloperDto extends (0, mapped_types_1.PartialType)(create_developer_dto_1.CreateDeveloperDto) {
}
exports.UpdateDeveloperDto = UpdateDeveloperDto;
//# sourceMappingURL=update-developer.dto.js.map