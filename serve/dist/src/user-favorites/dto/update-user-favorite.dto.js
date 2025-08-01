"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserFavoriteDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_user_favorite_dto_1 = require("./create-user-favorite.dto");
class UpdateUserFavoriteDto extends (0, mapped_types_1.PartialType)(create_user_favorite_dto_1.CreateUserFavoriteDto) {
}
exports.UpdateUserFavoriteDto = UpdateUserFavoriteDto;
//# sourceMappingURL=update-user-favorite.dto.js.map