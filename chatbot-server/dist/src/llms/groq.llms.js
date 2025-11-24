"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("@langchain/openai");
const groqOpenAI = new openai_1.ChatOpenAI({
    openAIApiKey: process.env.GROQ_API_KEY,
    configuration: {
        baseURL: "https://api.groq.com/openai/v1",
    },
    model: "llama-3.3-70b-versatile",
    temperature: 0.3,
});
exports.default = groqOpenAI;
//# sourceMappingURL=groq.llms.js.map