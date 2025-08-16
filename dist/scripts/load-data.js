"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ollama_1 = require("@langchain/ollama");
const documents_1 = require("@langchain/core/documents");
const text_splitter_1 = require("langchain/text_splitter");
const faiss_1 = require("@langchain/community/vectorstores/faiss");
const DATA_SOURCE = 'path/to/your/data.txt';
async function loadDocuments(dataSource) {
    console.log(`Loading documents from: ${dataSource}`);
    const dummyContent = `
    Bumi Nirwana Estate is a premier real estate company based in Indonesia.
    We specialize in luxury villas and sustainable housing projects.
    Our mission is to build dream homes that are in harmony with nature.
    Contact us at contact@buminirwana.com.
  `;
    return [new documents_1.Document({ pageContent: dummyContent })];
}
async function main() {
    console.log('--- Starting data loading process ---');
    const embeddings = new ollama_1.OllamaEmbeddings({
        baseUrl: 'http://localhost:4600',
        model: 'all-minilm:l6-v2',
    });
    const docs = await loadDocuments(DATA_SOURCE);
    if (docs.length === 0) {
        console.log('No documents found. Exiting.');
        return;
    }
    console.log(`Loaded ${docs.length} document(s).`);
    const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkSize: 256,
        chunkOverlap: 50,
    });
    const splits = await textSplitter.splitDocuments(docs);
    console.log(`Split documents into ${splits.length} chunks.`);
    const vectorStore = await faiss_1.FaissStore.fromDocuments(splits, embeddings);
    await vectorStore.save('faiss-index');
    console.log('--- Data loading process complete ---');
    console.log(`Faiss index created with ${splits.length} documents.`);
}
main().catch((err) => {
    console.error('An error occurred:', err);
    process.exit(1);
});
//# sourceMappingURL=load-data.js.map