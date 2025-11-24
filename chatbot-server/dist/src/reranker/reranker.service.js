"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RerankerService = void 0;
const common_1 = require("@nestjs/common");
const documents_1 = require("@langchain/core/documents");
const gpt_tokenizer_1 = require("gpt-tokenizer");
let RerankerService = class RerankerService {
    async callRerankAPI(query, docs) {
        try {
            const res = await fetch('http://localhost:8082/rerank', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    documents: docs.map(d => d.pageContent),
                }),
            });
            const json = await res.json();
            return json.results.map((r) => ({
                doc: docs[r.index],
                score: r.relevance_score,
            }));
        }
        catch (err) {
            return docs.map(d => ({ doc: d, score: 0 }));
        }
    }
    truncateDoc(doc, maxTokens) {
        const count = (0, gpt_tokenizer_1.encode)(doc.pageContent).length;
        if (count <= maxTokens)
            return doc;
        const approxChars = Math.floor(maxTokens * 4);
        return new documents_1.Document({
            pageContent: doc.pageContent.slice(0, approxChars),
            metadata: doc.metadata,
        });
    }
    async rerankInChunks(query, docs, chunkSize = 64) {
        const output = [];
        for (let i = 0; i < docs.length; i += chunkSize) {
            const chunk = docs.slice(i, i + chunkSize);
            const scored = await this.callRerankAPI(query, chunk);
            output.push(...scored);
        }
        return output;
    }
};
exports.RerankerService = RerankerService;
exports.RerankerService = RerankerService = __decorate([
    (0, common_1.Injectable)()
], RerankerService);
//# sourceMappingURL=reranker.service.js.map