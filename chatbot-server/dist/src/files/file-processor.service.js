"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessorService = void 0;
const common_1 = require("@nestjs/common");
const documents_1 = require("@langchain/core/documents");
const text_splitter_1 = require("./text-splitter");
const ollama_1 = require("@langchain/ollama");
const messages_1 = require("@langchain/core/messages");
let FileProcessorService = class FileProcessorService {
    constructor(visionModel) {
        this.visionModel = visionModel;
    }
    async process(file, vectorStore) {
        let pageContent = '';
        let metadata = {};
        if (file.mimetype.startsWith('image/')) {
            console.log('Image file detected, processing with Moondream for structured extraction...');
            const image_b64 = file.buffer.toString('base64');
            const newPrompt = `Analyze the content of this real estate image and extract the information into a structured JSON format. Identify the property name, location, developer, features, pricing, payment details, and any promotions. For pricing tables, list each property type with its corresponding price, down payment, and monthly installment plans for all available tenures (e.g., 10, 15, 20 years). If the image is a site plan or map, describe the layout, identify the property name, and list the available plot numbers or blocks shown. If a piece of information is not present in the image, use null as the value.`;
            const message = new messages_1.HumanMessage({
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
            pageContent = response.content;
            console.log('Structured Extraction Result:', pageContent);
            metadata = { source: 'image_description', file_name: file.originalname };
        }
        else {
            console.log('Text file detected.');
            pageContent = file.buffer.toString();
            metadata = { source: 'text_document', file_name: file.originalname };
        }
        const doc = new documents_1.Document({ pageContent, metadata });
        const chunks = await text_splitter_1.textSplitter.splitDocuments([doc]);
        await vectorStore.addDocuments(chunks);
    }
};
exports.FileProcessorService = FileProcessorService;
exports.FileProcessorService = FileProcessorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ollama_1.ChatOllama])
], FileProcessorService);
//# sourceMappingURL=file-processor.service.js.map