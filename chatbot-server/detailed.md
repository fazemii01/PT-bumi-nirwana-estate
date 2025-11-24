# Detailed Project Analysis: Chatbot Server

This document provides a comprehensive analysis of the NestJS-based chatbot server, detailing its architecture, technology stack, a component-by-component breakdown, and a complete development workflow.

## 1. Project Overview

This project is a sophisticated, multi-modal chatbot designed for the real estate domain, specifically as a "property assistant" named AskNirwana. It leverages a Retrieval-Augmented Generation (RAG) architecture to answer user queries based on a knowledge base of uploaded documents, including text files and images (like property brochures or site plans).

The application is built with a focus on modularity, performance, and evaluation, incorporating advanced techniques like multi-query retrieval, history-aware context, and an explicit reranking step to ensure response accuracy. The entire system is containerized for portability and ease of deployment.

## 2. Technology Stack

The project utilizes a modern stack for building AI-powered applications:

- **Backend Framework**: **NestJS** (v11) with TypeScript.
- **Real-time Communication**: **WebSockets** (via `@nestjs/platform-socket.io`) for live chat functionality.
- **Containerization**: **Docker** and **Docker Compose** to orchestrate the application and its dependent services (Weaviate).

---

### AI & Machine Learning Components:

- **Core AI Framework**: **LangChain** & **LangChain.js**, used to construct the entire RAG pipeline using the LangChain Expression Language (LCEL).
- **Vector Database**: **Weaviate** (v1.25.9), used for efficient storage and similarity search of document embeddings.
- **LLM Orchestration**:
    - **Local LLMs**: **Ollama** is used to serve models locally (from `http://localhost:4600`).
    - **Cloud LLMs**: **Groq** (`groq-sdk`) is integrated and used as the primary LLM for generation, indicating a focus on high-speed inference. The code allows for easy switching between Groq and local models like Llama 3.
- **Embedding Model**: `mxbai-embed-large` (served via Ollama) is used to convert text chunks into vector embeddings.
- **Vision Model**: `moondream` (served via Ollama) is a multi-modal model used to analyze uploaded images and extract structured text descriptions.
- **Reranking Service**: A custom, external reranking service (running at `http://localhost:8082/rerank`) is used to improve the relevance of retrieved documents. It is powered by a **Flask** (Python) server using a `sentence-transformers` Cross-Encoder model (`mixedbread-ai/mxbai-rerank-base-v1`).
- **Tokenizer**: `gpt-tokenizer` is used for accurately counting tokens for tasks like document truncation.

---

### Python Environment for Evaluation & Services:

A separate Python environment (`.venv`) is used for running external services and evaluating the chatbot's performance.
- **Evaluation Framework**: **Ragas** (`ragas_eval.py`) is used to score the quality of the RAG pipeline's outputs on metrics like faithfulness and answer relevancy.
- **Other Evaluation**: `bert_eval.py` suggests that standard BERT-based metrics are also used for evaluation.

## 3. Architecture and Data Flow

The application's architecture is centered around the `ChatService`, which orchestrates the two main workflows: **Data Ingestion** and **Query Processing**.

### 3.1. Data Ingestion Workflow

This workflow populates the Weaviate vector database with knowledge.

1.  **File Upload**: A user uploads a file (text or image) via the `POST /chat/upload` endpoint.
2.  **Content Extraction**:
    - **Image File**: The image is sent to the `moondream` vision model. A detailed prompt instructs the model to extract structured information (property name, pricing, features, etc.) into a JSON format, which is then used as the text content.
    - **Text File**: The file's buffer is read directly as text.
3.  **Chunking**: The extracted text content is split into smaller, overlapping chunks using `RecursiveCharacterTextSplitter`.
4.  **Embedding & Storage**: Each chunk is passed to the `mxbai-embed-large` embedding model to create a vector. This vector, along with the text content and metadata, is then stored in the `Chatbot` collection within the Weaviate database.
5.  **State Reset**: Upon new file uploads, the existing data in the Weaviate collection is cleared, and all active chat histories are deleted to ensure conversations are based on the most current knowledge base.

### 3.2. Query Processing Workflow (The RAG Chain)

This workflow generates a response to a user's message, handled in real-time via the WebSocket gateway.

1.  **Greeting Check**: The system first checks if the user's input is a simple greeting. If so, it bypasses the RAG chain and returns a standard greeting.
2.  **History-Aware Query Generation**: The user's question and conversation history are passed to the LLM (Groq) to generate a new, standalone search query that preserves context.
3.  **Multi-Query Retrieval**: The rephrased query is sent to the `MultiQueryRetriever`, which uses the LLM to generate 3 different versions of the query to cast a wider net during search.
4.  **Vector Search**: These queries are used to perform a similarity search against Weaviate, retrieving an initial set of up to 15 documents.
5.  **Reranking**: The retrieved documents are sent to the external Python Flask service. This service uses a powerful Cross-Encoder model to re-evaluate the documents against the original query and assign a more accurate relevance score.
6.  **Filtering & Selection**: The documents are sorted by their new score, and only the top 5 are selected. This is a critical quality control step.
7.  **Response Synthesis**: The top 5 reranked documents are combined with the chat history and original query into a final prompt. This prompt instructs the "AskNirwana" assistant to answer *only* from the provided context. The prompt is sent to the Groq LLM to generate the final answer.
8.  **State Update**: The user's message and the AI's answer are added to the session's chat history.

## 4. Detailed Project Structure

-   `docker-compose.yml`: Defines and configures the `weaviate` service, making the vector database easy to run.
-   `rerank.py`: A Python Flask server that exposes the `/rerank` endpoint. It loads a Sentence Transformers Cross-Encoder model to perform the computationally expensive reranking task.
-   `ragas_eval.py` / `bert_eval.py`: Python scripts used for offline evaluation of the RAG pipeline's performance.
-   `package.json`: Defines all Node.js dependencies, and scripts for running (`start:dev`), building (`build`), and testing (`test`) the application.
-   `nest-cli.json`, `tsconfig.json`: Configuration files for the NestJS framework and the TypeScript compiler.
-   **`src/`**: The main application source code.
    -   `main.ts`: The application entry point.
    -   `app.module.ts`: The root module, which imports the `ChatModule`.
    -   **`chat/`**: The core feature module.
        -   `chat.gateway.ts`: Manages WebSocket connections and events (`message`, `clear history`). It's the primary interface for real-time user interaction.
        -   `chat.service.ts`: **The heart of the application.** It contains the entire RAG logic, file processing methods, and state management for chat histories.
        -   `chat.controller.ts`: Defines the HTTP endpoints, primarily for file uploads.
    -   **`llms/`**: Contains configurations and instances for different LLMs (e.g., `groq.llms.ts`).
    -   **`weaviate/`**: Contains logic for connecting to and interacting with the Weaviate client.
    -   **`files/` & `reranker/`**: These directories contain service files (`file-processor.service.ts`, `reranker.service.ts`) that duplicate logic found in `chat.service.ts`. This suggests they are intended for a future refactoring to better separate concerns but are not currently being used in the main application flow.

## 5. Complete Development & Examination Workflow

This section outlines the logical steps to build and refine this project from scratch.

### Phase 1: Foundation and Scaffolding
1.  **Initialize Project**: Scaffold a new NestJS project: `nest new chatbot-server`.
2.  **Set Up Version Control**: Initialize a Git repository.
3.  **Containerize Services**: Create a `docker-compose.yml` to define and manage the Weaviate vector database service. This isolates dependencies from the start.
4.  **Install Core Dependencies**: Add initial npm packages for chat and AI: `@nestjs/websockets`, `socket.io`, `langchain`, `@langchain/weaviate`, `weaviate-client`.
5.  **Basic Chat Interface**: Create the `ChatModule`, `ChatGateway`, and `ChatController`. Implement a basic WebSocket "echo" server that receives a message and sends it back, confirming the connection works.

### Phase 2: Building the Initial RAG Pipeline
1.  **Data Ingestion**:
    -   Implement the `POST /chat/upload` endpoint.
    -   In `ChatService`, write the initial file processing logic to read text files, split them into chunks (`RecursiveCharacterTextSplitter`), and generate embeddings using a chosen model (e.g., `OllamaEmbeddings`).
    -   Connect to the Weaviate instance and implement the logic to store the document chunks and their vectors.
2.  **Basic Retrieval & Synthesis**:
    -   In `ChatService`, build the first version of the RAG chain using LangChain Expression Language (LCEL).
    -   **Chain**: `Retriever -> CombineDocumentsChain -> LLM -> StringOutputParser`.
    -   At this stage, the retriever is a simple `vectorStore.asRetriever()`. The LLM can be a local Ollama model or Groq.
3.  **Test and Verify**: Upload a test document and ask a question related to its content. Verify that the basic RAG flow works and returns a relevant answer.

### Phase 3: Enhancing the RAG Pipeline
1.  **Add Conversation History**: Implement session-based chat history management in `ChatService`. Modify the RAG chain to be history-aware by using `createHistoryAwareRetriever`. This allows the chatbot to understand follow-up questions.
2.  **Improve Retrieval**: To combat the limitations of basic vector search, wrap the base retriever in a `MultiQueryRetriever`. This uses the LLM to generate multiple perspectives of a user's query, improving the chances of finding relevant chunks.
3.  **Examine and Refine Prompts**: The quality of a RAG system is highly dependent on its prompts. Iteratively refine the prompts for the history-aware rephrasing, the multi-query generation, and the final answer synthesis.

### Phase 4: Implementing Advanced Quality Improvements
1.  **Identify Reranking Need**: After testing, you'll notice that the retriever sometimes brings back semi-relevant documents that distract the LLM. This identifies the need for a more robust reranking step.
2.  **Develop Reranker Service**:
    -   Create a separate Python project.
    -   Use Flask or FastAPI to build a simple web server.
    -   Load a powerful `CrossEncoder` model from a library like `sentence-transformers`.
    -   Expose a `/rerank` endpoint that accepts a query and documents, and returns relevance scores.
3.  **Integrate Reranker**: In `ChatService`, modify the RAG chain to call this external reranking service after the retrieval step. Filter the documents based on the new scores, keeping only the top N most relevant ones for the LLM.
4.  **Add Multi-Modal Capability**:
    -   Extend the file processing logic to detect image mime types.
    -   Integrate a vision model (like `moondream` via Ollama).
    -   Create a specific prompt that asks the vision model to "describe" the image in a structured way, converting visual information into text that can be embedded and searched.

### Phase 5: Evaluation and Iteration
1.  **Create an Evaluation Dataset**: Compile a set of question-answer pairs based on your knowledge documents. This is your "ground truth".
2.  **Set Up Evaluation Environment**: In the Python project, install `ragas` and other necessary libraries.
3.  **Implement Evaluation Script**: Write a script (`ragas_eval.py`) that runs your questions through the chatbot API, collects the responses and retrieved contexts, and scores them using Ragas metrics (e.g., `faithfulness`, `answer_relevancy`, `context_precision`).
4.  **Analyze and Tune**:
    -   Run the evaluation script and analyze the output scores (e.g., in `ragas_results.csv`).
    -   Identify weaknesses. Is context recall low? Is the LLM hallucinating?
    -   Tune the pipeline based on the results: adjust prompts, change the number of documents to retrieve/rerank, or even experiment with different embedding/LLM models.
5.  **Repeat**: This is a continuous loop. As you add more data or change the pipeline, you should re-run the evaluation to ensure you're not causing a regression in performance.

### Phase 6: Finalization
1.  **Refactor Code**: Clean up the `ChatService` by moving self-contained logic into dedicated services (like the existing `RerankerService` and `FileProcessorService` files).
2.  **Add Configuration and Error Handling**: Externalize configuration (like model names, ports) into `.env` files. Add robust error handling throughout the application.
3.  **Documentation**: Update the `README.md` with clear setup and usage instructions. The `detailed.md` file serves as the in-depth technical documentation.
4.  **Build for Production**: Use `npm run build` to create a production-ready build of the NestJS application.