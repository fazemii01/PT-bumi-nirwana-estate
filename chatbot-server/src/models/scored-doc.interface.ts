import { Document } from '@langchain/core/documents';

export interface ScoredDoc {
  doc: Document;
  score: number;
}
