"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWeaviateClient = createWeaviateClient;
const weaviate_client_1 = __importDefault(require("weaviate-client"));
async function createWeaviateClient() {
    return weaviate_client_1.default.connectToLocal({
        host: 'localhost',
        port: 4900,
        grpcPort: 50051,
    });
}
//# sourceMappingURL=weaviate.client.js.map