"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVisionModel = createVisionModel;
const ollama_1 = require("@langchain/ollama");
function createVisionModel() {
    return new ollama_1.ChatOllama({
        baseUrl: 'http://localhost:4600',
        model: 'moondream',
    });
}
//# sourceMappingURL=vision.js.map