# CHAPTER II
# THEORETICAL BASIS

This chapter describes the theoretical foundations and technologies that underpin the development of the Chatbot Server project. These technologies were selected to build a robust, scalable, and intelligent chatbot application.

## 2.1 NestJS Framework

NestJS is a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It is built with and fully supports TypeScript, while also allowing developers to code in pure JavaScript. NestJS uses modern JavaScript features and brings design patterns and mature solutions from the world of object-oriented programming (like Angular) to the Node.js ecosystem.

In this project, NestJS serves as the backbone of the server application. It provides the structure for organizing the code into modules, controllers, and services. It handles the HTTP server, routing for API endpoints (`/chat/ask`, `/chat/upload`), and the WebSocket gateway for real-time communication with clients.

## 2.2 TypeScript

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It is a superset of JavaScript, meaning any valid JavaScript code is also valid TypeScript code. The main advantage of TypeScript is its static type system, which helps catch errors during development before the code is run.

The entire `chatbot-server` codebase is written in TypeScript. This choice improves code quality, maintainability, and developer productivity by providing features like type checking, autocompletion, and interfaces for defining data structures like the `AskDto`.

## 2.3 Retrieval-Augmented Generation (RAG)

Retrieval-Augmented Generation (RAG) is an advanced AI architecture that combines a pre-trained large language model (LLM) with an external knowledge retrieval system. Instead of relying solely on the information it was trained on, the LLM can access and retrieve information from a specific knowledge base to generate more accurate, up-to-date, and contextually relevant responses.

This project is fundamentally a RAG system. The chatbot doesn't just generate answers from its internal knowledge; it retrieves relevant document chunks from a vector database (Weaviate) that has been populated with project-specific data. This allows the chatbot to answer questions about specific properties, pricing, and other details it wasn't originally trained on.

## 2.4 Large Language Models (LLMs) and Ollama

Large Language Models (LLMs) are a type of artificial intelligence model trained on vast amounts of text data to understand and generate human-like text.

Ollama is a tool that allows for running open-source LLMs, such as Llama 3, locally. This provides privacy and control over the models being used. In this project, Ollama is used to serve several models:
- **`llama3`**: The primary generative model used to synthesize the final answers for the user.
- **`mxbai-embed-large`**: A specialized model used to convert text documents into numerical vector representations (embeddings) for storage and retrieval.
- **`moondream`**: A vision model capable of analyzing images and extracting structured text information from them.

## 2.5 Vector Database and Weaviate

A vector database is a specialized database designed to store, manage, and search high-dimensional vector embeddings. Instead of traditional keyword matching, it uses similarity search (e.g., cosine similarity or Euclidean distance) to find the most relevant vectors to a given query vector.

This project uses Weaviate as its vector database. All the documents from the knowledge base are chunked, converted into embeddings by the `mxbai-embed-large` model, and stored in Weaviate. When a user asks a question, their query is also converted into an embedding, and Weaviate is used to find the most similar document chunks, which are then fed to the LLM.

## 2.6 LangChain

LangChain is a framework designed to simplify the creation of applications using large language models. It provides a standard interface for chains, agents, and memory modules, allowing developers to chain together different LLM calls and utilities to build complex applications like RAG systems.

LangChain is used extensively in this project to orchestrate the entire RAG pipeline. It is used to:
- Manage the chat history.
- Create history-aware prompts.
- Chain the retriever (which gets documents from Weaviate) and the LLM (which generates the answer).
- Parse the final output.

## 2.7 Docker

Docker is a platform that uses OS-level virtualization to deliver software in packages called containers. Containers are isolated from one another and bundle their own software, libraries, and configuration files; they can communicate with each other through well-defined channels.

In this project, Docker and Docker Compose are used to containerize the application and its dependencies, specifically the Weaviate database. This ensures a consistent development and deployment environment, making it easy to set up and run the entire system with a single command.

## 2.8 WebSockets

WebSocket is a communication protocol that provides full-duplex communication channels over a single TCP connection. It allows for real-time, bidirectional communication between a client and a server.

The `chatbot-server` uses WebSockets (via Socket.IO and NestJS's WebSocket gateway) to provide a real-time chat experience. When a user sends a message, the server can process it and push the response back to the client immediately without the client needing to poll for updates.
