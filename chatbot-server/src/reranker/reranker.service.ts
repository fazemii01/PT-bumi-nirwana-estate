import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { encode } from 'gpt-tokenizer';
import { ScoredDoc } from '../models/scored-doc.interface';

@Injectable()
export class RerankerService {
  private async callRerankAPI(query: string, docs: Document[]): Promise<ScoredDoc[]> {
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
    } catch (err) {
      return docs.map(d => ({ doc: d, score: 0 }));
    }
  }

  truncateDoc(doc: Document, maxTokens: number): Document {
    const count = encode(doc.pageContent).length;
    if (count <= maxTokens) return doc;

    const approxChars = Math.floor(maxTokens * 4);
    return new Document({
      pageContent: doc.pageContent.slice(0, approxChars),
      metadata: doc.metadata,
    });
  }

  async rerankInChunks(query: string, docs: Document[], chunkSize = 64): Promise<ScoredDoc[]> {
    const output: ScoredDoc[] = [];

    for (let i = 0; i < docs.length; i += chunkSize) {
      const chunk = docs.slice(i, i + chunkSize);
      const scored = await this.callRerankAPI(query, chunk);
      output.push(...scored);
    }

    return output;
  }
}
