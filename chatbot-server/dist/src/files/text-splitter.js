"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textSplitter = void 0;
const text_splitter_1 = require("langchain/text_splitter");
exports.textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 100,
    separators: ['\n\n## ', '\n## ', '\n\n# ', '\n# ', '\n\n', '\n', ' ', ''],
});
//# sourceMappingURL=text-splitter.js.map