# AI Chatbot Development Plan

This document outlines the plan for developing a web-based AI assistant for your company website.

## 1. Project Overview

The goal is to create an intelligent chatbot that assists users by answering questions based *only* on a specific set of company data. The chatbot will be integrated into the existing React-based company website, appearing as a clickable widget that opens a chat interface. The frontend UI will communicate with a separate backend server that houses the AI logic and data processing.

### Key Requirements:
- **UI:** A chat widget on the React frontend, triggered by a button click.
- **AI Core:** An LLM-powered brain running on a dedicated backend server.
- **Data Scoping:** The AI's knowledge must be strictly limited to the provided company data.
- **Architecture:** Decoupled frontend and backend architecture, communicating via APIs.

## 2. Proposed Architecture

A decoupled architecture is ideal for this project. It separates the user interface (frontend) from the complex AI logic (backend), allowing for independent development, scaling, and maintenance.

```mermaid
graph TD
    A[React Frontend] -->|HTTPS API Request (e.g., /chat)| B(Backend Server);
    B -->|1. Embed User Query| C(Embedding Model);
    B -->|2. Search for Context| D(Vector Database);
    D -->|3. Return Relevant Data Chunks| B;
    B -->|4. Send Query + Context to LLM| E(LLM API e.g., OpenAI, self-hosted);
    E -->|5. Generate Answer| B;
    B -->|6. Send Answer to Frontend| A;

    subgraph "User's Browser"
        A
    end

    subgraph "Chatbot Backend Server"
        B
        C
        D
        E
    end
```

## 3. Technology Stack Options

Here are the recommended technology stacks for each part of the project.

### A. Frontend (Chat UI)
Since your website is already using React, we'll stick with it.
- **Framework:** React / Next.js (as currently used in the `Client` directory).
- **UI Component Options:**
    1.  **Custom Component:** Build a new chat interface from scratch using React components for full control over UI/UX.
    2.  **Library:** Use a pre-built library like `react-chatbot-kit` to speed up development.

### B. Backend (AI Server)
This will be a new service running in the `chatbot-server` directory.
- **Option 1 (Recommended): Node.js with NestJS**
    - **Why:** Your existing `serve` application uses NestJS, so your team already has the expertise. Node.js is excellent for I/O-heavy applications like a chat service.
    - **Libraries:** `express`, `langchain.js` (for RAG pipeline), `@nestjs/websockets` (for real-time chat).
- **Option 2: Python with FastAPI**
    - **Why:** Python is the industry standard for AI/ML and has the most extensive libraries (`langchain`, `llama-index`, `transformers`). It's a very strong choice if performance for AI tasks is the top priority.

### C. AI & Data

This section details how to make the AI work and ensure it only uses your company's data. The recommended method is **Retrieval-Augmented Generation (RAG)**.

#### Method: Retrieval-Augmented Generation (RAG)
RAG is the best approach for your use case because it doesn't require retraining an entire LLM. Instead, it retrieves relevant information from your data and provides it to the LLM as context to formulate an answer. This naturally restricts the AI to your provided data.

**How RAG Works:**
1.  **Data Loading & Processing:** Your data (e.g., PDFs, text files, website content) is loaded and split into smaller, manageable chunks.
2.  **Embedding:** Each chunk of text is converted into a numerical representation (a "vector") using an embedding model.
3.  **Vector Storage:** These vectors are stored in a specialized **Vector Database**.
4.  **Runtime:**
    - A user sends a question.
    - The question is converted into a vector.
    - The system searches the vector database for the most similar text chunks (the most relevant context).
    - The original question and the retrieved context are passed to an LLM with a prompt like: "Using only the following context, answer the user's question."
    - The LLM generates an answer based *only* on that context.

#### Technology Choices for RAG:
- **Vector Database:**
    - **ChromaDB (Recommended to start):** Easy to set up and run locally. Perfect for development.
    - **Pinecone / Weaviate:** Powerful, scalable, managed cloud solutions for production.
- **Embedding Models:**
    - **Sentence-Transformers (Open Source):** High-quality models that can be run locally/on-premise.
    - **OpenAI `text-embedding-ada-002` (API):** Very powerful and easy to use via API.
- **Self-Hosted AI Models (via Ollama):**
    - **Why Self-Host?** Full data privacy, no API costs, and complete control over the models.
    - **A. Generative LLM (for Chat):** This model generates answers.
        - **`gemma:2b` (Recommended):** A fast and lightweight model from Google, well-suited for chat and summarization. A great starting point.
        - **`phi-3-mini`:** A very capable small model from Microsoft.
        - **`llama3:8b`:** Meta's powerful model. Requires more resources (VRAM) but offers higher quality responses.
    - **B. Embedding Model (for Retrieval):** This model converts text to vectors for database search.
        - **`nomic-embed-text` (Recommended):** A top-performing and efficient embedding model available on Ollama.
        - **`all-minilm`:** A classic, lightweight embedding model. Fast and requires minimal resources.

### D. Self-Hosted AI Environment Options

To run these models, you need a dedicated environment. Here are the best options for getting started.

- **Option 1 (Recommended for Development): Ollama**
    - **What it is:** A tool that makes it incredibly easy to download, run, and manage open-source LLMs locally on your machine (Windows, macOS, Linux). It provides a simple API endpoint that your NestJS backend can call, just like a cloud API.
    - **Why:** Simplifies setup drastically. You can get a model running with a single command (`ollama run gemma-2b-it`). Perfect for development and even small-scale production.

- **Option 2 (For Production & Scalability): Docker with vLLM/TGI**
    - **What it is:** A more advanced setup where you run the LLM in a dedicated Docker container using an optimized inference server like `vLLM` or Hugging Face's `Text Generation Inference (TGI)`.
    - **Why:** Provides the best performance (throughput and latency) for production workloads. Requires a server with a powerful GPU (e.g., NVIDIA).

## 4. Development Plan & TODO List

Here is a step-by-step plan to build the chatbot.

- [ ] **Phase 1: Backend API Setup**
- [ ] **Phase 2: AI - RAG Pipeline Implementation**
- [ ] **Phase 3: Frontend Chat UI Development**
- [ ] **Phase 4: Integration, Deployment & Testing**

I will now create a detailed TODO list for you to track the progress.