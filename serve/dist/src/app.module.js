"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const properties_module_1 = require("./properties/properties.module");
const agents_module_1 = require("./agents/agents.module");
const auths_module_1 = require("./auths/auths.module");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const developers_module_1 = require("./developers/developers.module");
const file_module_1 = require("./file/file.module");
const search_module_1 = require("./search/search.module");
const user_favorites_module_1 = require("./user-favorites/user-favorites.module");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_guard_1 = require("@/auths/jwt-auth-guard.guard");
const auths_guard_1 = require("@/auths/auths.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: true,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            properties_module_1.PropertiesModule,
            agents_module_1.AgentsModule,
            auths_module_1.AuthsModule,
            chatbot_module_1.ChatbotModule,
            developers_module_1.DevelopersModule,
            file_module_1.FileModule,
            search_module_1.SearchModule,
            user_favorites_module_1.UserFavoritesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: auths_guard_1.RoleGuard,
            },
            {
                provide: core_1.APP_PIPE,
                useClass: common_1.ValidationPipe,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map