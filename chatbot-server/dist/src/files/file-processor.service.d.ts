import { ChatOllama } from '@langchain/ollama';
import { WeaviateStore } from '@langchain/weaviate';
export declare class FileProcessorService {
    private readonly visionModel;
    constructor(visionModel: ChatOllama);
    process(file: Express.Multer.File, vectorStore: WeaviateStore): Promise<void>;
}
