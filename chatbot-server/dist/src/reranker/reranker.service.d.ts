import { Document } from '@langchain/core/documents';
import { ScoredDoc } from '../models/scored-doc.interface';
export declare class RerankerService {
    private callRerankAPI;
    truncateDoc(doc: Document, maxTokens: number): Document;
    rerankInChunks(query: string, docs: Document[], chunkSize?: number): Promise<ScoredDoc[]>;
}
