import { Injectable, OnModuleInit } from '@nestjs/common';
import { Ollama, OllamaEmbeddings } from '@langchain/ollama';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createWorker } from 'tesseract.js';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOllama } from '@langchain/ollama';
import { HumanMessage } from '@langchain/core/messages';
import {
  RunnableSequence,
  RunnablePassthrough,
  RunnableParallel,
} from '@langchain/core/runnables';
import { FaissStore } from '@langchain/community/vectorstores/faiss';

@Injectable()
export class ChatService implements OnModuleInit {
  private chain: RunnableSequence;
  private vectorStore: FaissStore;
  private embeddings: OllamaEmbeddings;
  private visionModel: ChatOllama;

  async onModuleInit() {
    this.embeddings = new OllamaEmbeddings({
      baseUrl: 'http://localhost:4600',
      model: 'all-minilm:l6-v2',
    });

    this.visionModel = new ChatOllama({
      baseUrl: 'http://localhost:4600',
      model: 'moondream',
    });

    try {
      console.log('Attempting to load Faiss index from disk...');
      this.vectorStore = await FaissStore.load('faiss-index', this.embeddings);
      this.initializeChain(); 
      console.log('Faiss index loaded successfully and chain initialized.');
    } catch (e) {
      console.log('No existing Faiss index found. A new one will be created upon file upload.');
    }
  }

  private initializeChain(): void {
    const ollama = new Ollama({
      baseUrl: 'http://localhost:4600',
      model: 'gemma:2b',
    });

    const retriever = this.vectorStore.asRetriever();

    const template = `Answer the question based only on the following context:
{context}

Question: {question}`;

    const prompt = PromptTemplate.fromTemplate(template);

    this.chain = RunnableSequence.from([
      {
        context: retriever.pipe(this.formatDocs),
        question: new RunnablePassthrough(),
      },
      prompt,
      ollama,
      new StringOutputParser(),
    ]);
  }

  private formatDocs(docs: Document[]): string {
    return docs.map((doc) => doc.pageContent).join('\n\n');
  }

  async ask(message: string): Promise<string> {
    if (!this.vectorStore) {
      return "I am sorry, but I have no knowledge base to answer your question. Please upload a file first.";
    }
    if (!this.chain) {
      // This can happen if the app starts without a faiss-index
      this.initializeChain();
    }

    console.log('Invoking chain with question...');
    const result = await this.chain.invoke(message);
    console.log('AI Answer:', result);
    return result;
  }

  async processFile(file: Express.Multer.File): Promise<void> {
    console.log(`Processing file: ${file.originalname} (${file.mimetype})`);

    if (!file || !file.buffer) {
      throw new Error('No file buffer found. Make sure multer.memoryStorage() is used.');
    }

    let pageContent: string;

    if (file.mimetype.startsWith('image/')) {
      console.log('Image file detected, processing with Moondream...');
      const image_b64 = file.buffer.toString('base64');
      const message = new HumanMessage({
        content: [
          {
            type: 'text',
            text: 'Transcribe all text from this image. Be precise and include all details, including prices and contact information.',
          },
          {
            type: 'image_url',
            image_url: `data:image/jpeg;base64,${image_b64}`,
          },
        ],
      });
      const response = await this.visionModel.invoke([message]);
      pageContent = response.content as string;
      console.log('Moondream Transcription:', pageContent);

      /*
      // --- SHARP + TESSERACT IMPLEMENTATION (FOR STUDY) ---
      console.log('Image file detected, performing advanced pre-processing with Sharp...');
      const processedBuffer = await require('sharp')(file.buffer)
        .resize(2000) // Resize for better OCR
        .greyscale()
        .normalize()
        .sharpen()
        .threshold(128) // Convert to black and white
        .toBuffer();

      console.log('Performing OCR on processed image...');
      const worker = await createWorker('ind', 1);
      const ret = await worker.recognize(processedBuffer);
      const ocrText = ret.data.text;
      await worker.terminate();
      console.log('Raw OCR Result:', ocrText);

      // Clean up the OCR text
      const cleanedText = ocrText
        .replace(/\n/g, ' ') // Replace newlines with spaces
        .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
        .split(' ')
        .filter(word => word.length > 2) // Remove short, likely incorrect words
        .join(' ');
      
      pageContent = cleanedText;
      console.log('Cleaned OCR Text:', pageContent);
      */
    } else {
      console.log('Text file detected.');
      pageContent = file.buffer.toString();
    }

    const doc = new Document({ pageContent });

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512,
      chunkOverlap: 50,
    });
    const splits = await textSplitter.splitDocuments([doc]);
    console.log(`Split document into ${splits.length} chunks.`);

    // Process chunks in batches
    const batchSize = 32;
    for (let i = 0; i < splits.length; i += batchSize) {
      const batch = splits.slice(i, i + batchSize);
      console.log(`Processing batch ${i / batchSize + 1}...`);

      if (!this.vectorStore) {
        this.vectorStore = await FaissStore.fromDocuments(batch, this.embeddings);
      } else {
        await this.vectorStore.addDocuments(batch);
      }
    }

    await this.vectorStore.save('faiss-index');
    this.initializeChain();
    console.log('File processed and Faiss index saved.');
  }
}