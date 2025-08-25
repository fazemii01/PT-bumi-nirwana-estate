import { OllamaEmbeddings } from '@langchain/ollama';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { MarkdownTextSplitter } from 'langchain/text_splitter';

const DATA_SOURCE = 'path/to/your/data.txt';


async function loadDocuments(dataSource: string): Promise<Document[]> {
  console.log(`Loading documents from: ${dataSource}`);
  // Example: Loading a simple text file
  // import * as fs from 'fs/promises';
  // const text = await fs.readFile(dataSource, 'utf-8');
  // return [new Document({ pageContent: text })];


  const dummyContent = `
    Bumi Nirwana Estate is a premier real estate company based in Indonesia.
    We specialize in luxury villas and sustainable housing projects.
    Our mission is to build dream homes that are in harmony with nature.
    Contact us at contact@buminirwana.com.
  `;
  return [new Document({ pageContent: dummyContent })];
}


async function main() {
  console.log('--- Starting data loading process ---');


  const embeddings = new OllamaEmbeddings({
    baseUrl: 'http://localhost:4600',
    model: 'nomic-embed-text',
  });


  const docs = await loadDocuments(DATA_SOURCE);
  if (docs.length === 0) {
    console.log('No documents found. Exiting.');
    return;
  }
  console.log(`Loaded ${docs.length} document(s).`);


  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 50,
  });
  const splits = await textSplitter.splitDocuments(docs);
  console.log(`Split documents into ${splits.length} chunks.`);
  

  const vectorStore = await FaissStore.fromDocuments(splits, embeddings);
  await vectorStore.save('faiss-index');


  console.log('--- Data loading process complete ---');
  console.log(`Faiss index created with ${splits.length} documents.`);
}


main().catch((err) => {
  console.error('An error occurred:', err);
  process.exit(1);
});