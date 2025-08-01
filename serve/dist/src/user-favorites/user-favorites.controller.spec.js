"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_favorites_controller_1 = require("./user-favorites.controller");
const user_favorites_service_1 = require("./user-favorites.service");
describe('UserFavoritesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [user_favorites_controller_1.UserFavoritesController],
            providers: [user_favorites_service_1.UserFavoritesService],
        }).compile();
        controller = module.get(user_favorites_controller_1.UserFavoritesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=user-favorites.controller.spec.js.map