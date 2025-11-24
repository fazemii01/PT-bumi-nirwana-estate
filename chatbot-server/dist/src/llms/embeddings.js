"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmbeddingModel = createEmbeddingModel;
const ollama_1 = require("@langchain/ollama");
function createEmbeddingModel() {
    return new ollama_1.OllamaEmbeddings({
        baseUrl: 'http://localhost:4600',
        model: 'mxbai-embed-large',
    });
}
//# sourceMappingURL=embeddings.js.map