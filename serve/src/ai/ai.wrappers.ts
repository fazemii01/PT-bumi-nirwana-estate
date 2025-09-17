import { OllamaService } from '@/ollama/ollama.service';
import {
  BaseEmbedding,
  BaseNodePostprocessor,
  ChatResponse,
  ChatResponseChunk,
  CompletionResponse,
  extractText,
  LLM,
  LLMChatParamsNonStreaming,
  LLMChatParamsStreaming,
  LLMCompletionParamsNonStreaming,
  LLMCompletionParamsStreaming,
  LLMMetadata,
  MessageContent,
  MetadataMode,
  NodeWithScore,
} from 'llamaindex';
export class CustomOllamaLLM implements LLM {
  constructor(
    private ollamaService: OllamaService,
    private model: string,
  ) {}

  get metadata(): LLMMetadata {
    return {
      model: this.model,
      temperature: 0.1,
      topP: 1,
      maxTokens: undefined,
      contextWindow: 128000,
      tokenizer: undefined,
      structuredOutput: false,
    };
  }

  chat(
    params: LLMChatParamsStreaming,
  ): Promise<AsyncIterable<ChatResponseChunk>>;

  chat(params: LLMChatParamsNonStreaming): Promise<ChatResponse>;

  async chat(
    params: LLMChatParamsStreaming | LLMChatParamsNonStreaming,
  ): Promise<ChatResponse | AsyncIterable<ChatResponseChunk>> {
    if (params.stream) {
      throw new Error(
        'Streaming is not supported by this custom Ollama implementation.',
      );
    }

    const { messages } = params;
    const lastMessage = messages[messages.length - 1].content;

    const response = await this.ollamaService.generate(
      lastMessage as string,
      this.model,
    );

    return {
      raw: response,
      message: {
        content: response.response,
        role: 'assistant',
      },
    };
  }

  complete(
    params: LLMCompletionParamsStreaming,
  ): Promise<AsyncIterable<CompletionResponse>>;
  complete(
    params: LLMCompletionParamsNonStreaming,
  ): Promise<CompletionResponse>;
  async complete(
    params: LLMCompletionParamsStreaming | LLMCompletionParamsNonStreaming,
  ): Promise<CompletionResponse | AsyncIterable<CompletionResponse>> {
    if (params.stream) {
      throw new Error("Streaming for 'complete' is not supported.");
    }

    const prompt = extractText(params.prompt);
    const response = await this.ollamaService.generate(prompt, this.model);

    return {
      text: response.response,
      raw: response,
    };
  }
}

export class CustomOllamaReranker implements BaseNodePostprocessor {
  constructor(
    private ollamaService: OllamaService,
    private rerankModel: string,
    private topN: number = 3,
  ) {}

  async postprocessNodes(
    nodes: NodeWithScore[],
    query?: MessageContent,
  ): Promise<NodeWithScore[]> {
    if (nodes.length === 0) {
      return [];
    }
    if (query === undefined) {
      throw new Error('Reranking requires a query.');
    }
    const queryStr = extractText(query);

    const candidateDocuments = nodes.map((node) =>
      node.node.getContent(MetadataMode.ALL),
    );

    const rerankedResults = await this.ollamaService.rerank(
      queryStr,
      candidateDocuments,
      this.rerankModel,
    );

    const nodeMap = new Map<string, NodeWithScore>();
    for (const node of nodes) {
      nodeMap.set(node.node.getContent(MetadataMode.ALL), node);
    }

    const newNodes: NodeWithScore[] = [];
    for (const result of rerankedResults) {
      const originalNode = nodeMap.get(result.text);
      if (originalNode) {
        newNodes.push({
          node: originalNode.node,
          score: result.score,
        });
      }
    }

    return newNodes.slice(0, this.topN);
  }
}

export class CustomOllamaEmbedding extends BaseEmbedding {
  constructor(
    private ollamaService: OllamaService,
    private model: string,
  ) {
    super();
  }

  async getTextEmbedding(text: string): Promise<number[]> {
    return this.ollamaService.embeddings(text, this.model);
  }
}
