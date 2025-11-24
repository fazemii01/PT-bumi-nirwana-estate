"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVectorStore = createVectorStore;
const weaviate_1 = require("@langchain/weaviate");
function createVectorStore(client, embeddings) {
    return new weaviate_1.WeaviateStore(embeddings, {
        client: client,
        indexName: 'Chatbot',
    });
}
//# sourceMappingURL=weaviate.store.js.map