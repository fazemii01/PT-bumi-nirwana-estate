import { ChromaClient } from 'chromadb';
import { OllamaEmbeddings } from '@langchain/community/embeddings/ollama';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Chroma } from '@langchain/community/vectorstores/chroma';

// --- 1. Define Data Source ---
// Replace this with the actual path to your data file or directory.
const DATA_SOURCE = 'path/to/your/data.txt';

// --- 2. Load Documents ---
// This is a placeholder function. You will need to implement the logic
// to load your specific data (e.g., from a text file, PDF, etc.).
async function loadDocuments(dataSource: string): Promise<Document[]> {
  console.log(`Loading documents from: ${dataSource}`);
  // Example: Loading a simple text file
  // import * as fs from 'fs/promises';
  // const text = await fs.readFile(dataSource, 'utf-8');
  // return [new Document({ pageContent: text })];

  // For now, we'll use a dummy document.
  const dummyContent = `
    Bumi Nirwana Estate is a premier real estate company based in Indonesia.
    We specialize in luxury villas and sustainable housing projects.
    Our mission is to build dream homes that are in harmony with nature.
    Contact us at contact@buminirwana.com.
  `;
  return [new Document({ pageContent: dummyContent })];
}

// --- 3. Main Data Loading and Processing Function ---
async function main() {
  console.log('--- Starting data loading process ---');

  // Initialize Ollama Embeddings
  const embeddings = new OllamaEmbeddings({
    baseUrl: 'http://localhost:11434',
    model: 'all-minilm',
  });

  // Load the documents from the source
  const docs = await loadDocuments(DATA_SOURCE);
  if (docs.length === 0) {
    console.log('No documents found. Exiting.');
    return;
  }
  console.log(`Loaded ${docs.length} document(s).`);

  // Split the documents into smaller chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);
  console.log(`Split documents into ${splits.length} chunks.`);

  // Initialize ChromaDB client and create a collection
  const client = new ChromaClient();
  const collectionName = 'company-data';

  // Ensure the collection is created before adding documents
  await client.createCollection({ name: collectionName });
  console.log(`ChromaDB collection "${collectionName}" created or already exists.`);

  // Create a new vector store and add the document chunks
  const vectorStore = await Chroma.fromDocuments(splits, embeddings, {
    collectionName,
    url: 'http://localhost:8000', // Default ChromaDB URL
  });

  console.log('--- Data loading process complete ---');
  const collection = await new ChromaClient().getCollection({ name: collectionName });
  if (collection) {
    console.log(`Vector store created with ${await collection.count()} documents.`);
  } else {
    console.log('Could not retrieve collection from ChromaDB.');
  }
}

// --- Run the main function ---
main().catch((err) => {
  console.error('An error occurred:', err);
  process.exit(1);
});