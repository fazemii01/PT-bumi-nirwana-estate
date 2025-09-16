# Chatbot Server Summary

This document provides a detailed summary of the chatbot server, including its architecture, the technologies used, its API endpoints, and data models.

## Architecture

The chatbot server is built using a Retrieval-Augmented Generation (RAG) architecture, which is a sophisticated approach for building chatbots that can answer questions based on a specific knowledge base. The entire application is containerized using Docker, with a `docker-compose.yml` file orchestrating the different services.

The core components of the architecture are:

*   **NestJS Application**: The main application is a NestJS server that provides the API endpoints and WebSocket gateway for interacting with the chatbot.
*   **Weaviate Vector Database**: The chatbot uses Weaviate as its vector database. Weaviate is responsible for storing the vector representations of the knowledge base and performing efficient similarity searches.
*   **Ollama LLMs**: The chatbot leverages local Large Language Models (LLMs) through Ollama. It uses two different models:
    *   `mxbai-embed-large`: For creating vector embeddings of the text data.
    *   `llama3`: For generating the final responses.
    *   `moondream`: A vision model for extracting structured information from images.
*   **Reranking Service**: A separate reranking service (running on `http://localhost:8082/rerank`) is used to improve the relevance of the retrieved documents.

### How the Chatbot Works

The chatbot's workflow can be broken down into two main parts: data processing and query processing.

**1. Data Processing:**

*   The chatbot can be "fed" with data by uploading files (both text and images) through the `/chat/upload` endpoint.
*   **Image Processing**: If an image is uploaded, it's processed by the `moondream` vision model to extract structured information in JSON format. This allows the chatbot to understand the content of images, such as property brochures or site plans.
*   **Text Processing**: Text files are read directly.
*   **Chunking**: The content of the files is split into smaller chunks.
*   **Vectorization and Indexing**: Each chunk is converted into a vector embedding using the `mxbai-embed-large` model, and these embeddings are stored in the Weaviate vector database.

**2. Query Processing:**

*   When a user asks a question, the chatbot uses a multi-step process to generate a response:
    1.  **History-Aware Retrieval**: The chatbot considers the previous conversation to rephrase the user's query, which helps in retrieving more relevant documents.
    2.  **Multi-Query Retrieval**: It generates multiple versions of the user's query to broaden the search and improve the chances of finding relevant information.
    3.  **Similarity Search**: It searches the Weaviate vector database for the most similar documents to the user's query.
    4.  **Reranking**: The retrieved documents are then reranked based on their relevance to the original query.
    5.  **Document Synthesis**: The top-ranked documents are passed to the `llama3` LLM, along with the user's query and the chat history. The LLM uses this context to generate a final answer.

## Technologies Used

*   **Framework**: NestJS
*   **Language**: TypeScript
*   **AI/ML & NLP**:
    *   LangChain
    *   Ollama (for local LLMs)
    *   Weaviate (vector database)
    *   Moondream (for image processing)
    *   gpt-tokenizer
*   **Real-time Communication**: WebSockets (Socket.IO)
*   **Containerization**: Docker

## API Endpoints

The chatbot server exposes the following HTTP endpoints:

*   `POST /chat/upload`: Upload a single file to the chatbot's knowledge base.
*   `POST /chat/ask`: Ask a question to the chatbot.

## WebSocket Events

The chatbot server uses WebSockets for real-time communication. The following events are supported:

*   `message`: Send a message to the chatbot.
*   `response`: Receive a response from the chatbot.
*   `clear history`: Clear the chat history for the current session.
*   `disconnect`: Triggered when a client disconnects from the server.

## Data Models

*   **`AskDto`**:
    *   `message`: `string` - The user's message.
    *   `sessionId`: `string` - The unique identifier for the chat session.
*   **`ScoredDoc`**:
    *   `doc`: `Document` - The retrieved document.
    *   `score`: `number` - The relevance score of the document.
