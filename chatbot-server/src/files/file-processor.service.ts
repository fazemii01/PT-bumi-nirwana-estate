import { Injectable } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { textSplitter } from './text-splitter';
import { ChatOllama } from '@langchain/ollama';
import { WeaviateStore } from '@langchain/weaviate';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class FileProcessorService {
    constructor(
        private readonly visionModel: ChatOllama,
    ) { }

    async process(file: Express.Multer.File, vectorStore: WeaviateStore): Promise<void> {
        let pageContent = '';
        let metadata = {};
        if (file.mimetype.startsWith('image/')) {
            console.log(
                'Image file detected, processing with Moondream for structured extraction...',
            );
            const image_b64 = file.buffer.toString('base64');
            const newPrompt = `Analyze the content of this real estate image and extract the information into a structured JSON format. Identify the property name, location, developer, features, pricing, payment details, and any promotions. For pricing tables, list each property type with its corresponding price, down payment, and monthly installment plans for all available tenures (e.g., 10, 15, 20 years). If the image is a site plan or map, describe the layout, identify the property name, and list the available plot numbers or blocks shown. If a piece of information is not present in the image, use null as the value.`;

            const message = new HumanMessage({
                content: [
                    {
                        type: 'text',
                        text: newPrompt,
                    },
                    {
                        type: 'image_url',
                        image_url: `data:image/jpeg;base64,${image_b64}`,
                    },
                ],
            });

            const response = await this.visionModel.invoke([message]);
            pageContent = response.content as string;
            console.log('Structured Extraction Result:', pageContent);
            metadata = { source: 'image_description', file_name: file.originalname };
        } else {
            console.log('Text file detected.');
            pageContent = file.buffer.toString();
            metadata = { source: 'text_document', file_name: file.originalname };
        }


        const doc = new Document({ pageContent, metadata });
        const chunks = await textSplitter.splitDocuments([doc]);

        await vectorStore.addDocuments(chunks);
    }
}
