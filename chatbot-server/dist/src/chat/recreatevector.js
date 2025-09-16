"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const weaviate_client_1 = __importDefault(require("weaviate-client"));
async function recreateChatbotSchema() {
    const client = await weaviate_client_1.default.connectToLocal({
        host: 'localhost',
        port: 4900,
        grpcPort: 50051,
    });
    const indexName = 'Chatbot';
    const collections = await client.collections.listAll();
    if (collections.some(c => c.name === indexName)) {
        console.log(`Deleting old collection: ${indexName}`);
        await client.collections.delete(indexName);
    }
    await client.collections.create({
        name: indexName,
        properties: [
            { name: 'text', dataType: 'text' },
            { name: 'source', dataType: 'text' },
            { name: 'file_name', dataType: 'text' }
        ],
        vectorizers: weaviate_client_1.default.configure.vectorizer.none(),
    });
    console.log(`Weaviate collection "${indexName}" recreated successfully.`);
}
recreateChatbotSchema().catch(console.error);
//# sourceMappingURL=recreatevector.js.map