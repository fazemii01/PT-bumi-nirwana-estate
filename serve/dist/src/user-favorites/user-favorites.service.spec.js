"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const user_favorites_service_1 = require("./user-favorites.service");
describe('UserFavoritesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [user_favorites_service_1.UserFavoritesService],
        }).compile();
        service = module.get(user_favorites_service_1.UserFavoritesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=user-favorites.service.spec.js.map