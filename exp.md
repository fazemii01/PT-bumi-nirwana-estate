# Chatbot Project Explanation

This project is a high-performance, full-stack **Retrieval-Augmented Generation (RAG) Chatbot** designed to act as an expert property assistant named **AskNirwana**. Its primary function is to answer user queries related to real estate and property information using a dedicated knowledge base. The system is engineered for high accuracy by integrating advanced retrieval and reranking techniques.

## 1. Program Purpose

The chatbot serves as an intelligent agent for a property enterprise, providing detailed, context-aware answers to user questions about properties, pricing, payment plans (cicilan, uang muka), locations, and promotions. It includes a sophisticated content ingestion pipeline that can process both text documents and images, extracting structured data from visual content using a dedicated Vision Model.

Key functions include:
*   **Conversational Q&A:** Answering questions based strictly on proprietary knowledge stored in a vector database, while maintaining chat history (`chat_history` in the RAG chain).
*   **Knowledge Management:** Features to upload new knowledge files (text and images), delete existing knowledge, and fetch documents lists and keywords for administrative dashboards (Word Cloud data).
*   **Image Processing:** Using a multimodal LLM (Moondream/Ollama) to analyze and extract structured information from images (e.g., pricing tables, site plans) before vectorizing it.

## 2. Technologies and Frameworks Used

The project is primarily a backend application built with modern JavaScript/TypeScript technologies and several AI/LLM libraries.

| Category | Technology | Files/Context | Role |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | NestJS (TypeScript/Node.js) | [`package.json`](package.json), [`src/main.ts`](src/main.ts) | Provides a modular, scalable server architecture (controllers, services, modules) for API endpoints and WebSocket gateway. |
| **Vector Database** | Weaviate | [`docker-compose.yml`](docker-compose.yml), [`src/weaviate/weaviate.client.ts`](src/weaviate/weaviate.client.ts), [`src/chat/chat.service.ts`](src/chat/chat.service.ts) | Stores vector embeddings of proprietary documents (collection named 'Chatbot') and performs similarity searches. Configured via Docker to run on ports 4900 (HTTP) and 50051 (gRPC). |
| **LLM Orchestration** | LangChain.js | [`package.json`](package.json) (`@langchain/*`), [`src/chat/chat.service.ts`](src/chat/chat.service.ts) | Manages the complex RAG chain, including history-aware retrieval, multi-query generation, document splitting (`RecursiveCharacterTextSplitter`), and chain orchestration (`RunnableSequence`, `RunnableBranch`). |
| **Language Models (LLMs)** | Groq, Ollama, OpenAI | [`package.json`](package.json) (`groq-sdk`, `openai`, `@langchain/ollama`), [`src/chat/chat.service.ts`](src/chat/chat.service.ts) | **Groq/OpenAI:** Used for the main RAG synthesis chain (`groqOpenAI`), multi-query generation, keyword extraction, and citation tagging. **Ollama:** Used for embeddings (`OllamaEmbeddings`) and the vision model (`ChatOllama` - likely running Moondream) for image analysis. |
| **Cloud Storage** | Supabase | [`package.json`](package.json) (`@supabase/supabase-js`), [`src/chat/chat.service.ts`](src/chat/chat.service.ts) | Used to upload and manage the original source files (text documents and images) in a bucket named `data-knowledge`, providing signed URLs for access. |
| **Data Preprocessing** | Reranker Service | [`src/chat/chat.service.ts`](src/chat/chat.service.ts:144) | An external service (running on `http://localhost:8082/rerank`) is called to rerank retrieved documents, improving the relevance of context passed to the final LLM. |
| **Utilities** | `gpt-tokenizer`, `tesseract.js` (unconfirmed use), `sharp` | [`package.json`](package.json) | Used for token counting (for chunking/reranking budget) and potentially image manipulation/OCR (though the current image processing relies on the vision LLM). |

## 3. Project Architecture (RAG Pipeline)

The core logic resides in [`ChatService`](src/chat/chat.service.ts:43:1). The RAG process follows these steps:

1.  **Input & History:** A user message and current chat history are received.
2.  **Greeting Check:** A check is performed to bypass RAG if the message is a simple greeting, providing a fast, static response.
3.  **History-Aware Retrieval:**
    *   The user query and chat history are passed to an LLM to generate a rephrased, search-optimized query.
    *   This query is passed to a `MultiQueryRetriever` which generates 3 alternative versions of the search query to improve coverage.
4.  **Vector Search:** The queries are executed against the Weaviate vector store (`Chatbot` collection), using `OllamaEmbeddings` for vector conversion, to retrieve top `k=15` relevant documents.
5.  **Document Filtering & Reranking:**
    *   Documents are filtered to include only `text_document` or `image_description` types.
    *   The filtered documents are sent to the external Reranker service (`http://localhost:8082/rerank`).
    *   The top 5 documents by relevance score are selected as the final context.
6.  **Synthesis:**
    *   The selected top documents (`{context}`), chat history, and the original user query (`{input}`) are formatted into a structured prompt (`synthesisPrompt`).
    *   The prompt instructs the LLM (Groq) to act as **AskNirwana** and answer *only* from the provided context.
7.  **Citation Tagging:** After generating the main answer, a separate `taggingChain` uses an LLM to analyze the answer and the original source snippets to generate a concise summary tag (e.g., "Pricing", "Location") for each used source document, which is added to the `sourceDocuments` metadata.
8.  **Output:** The final result is returned as a structured object (`RagResult`) containing the `answer` string and the list of `sourceDocuments` with embedded citation tags.
