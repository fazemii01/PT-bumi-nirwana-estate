# Chatbot Implementation Plan

This document outlines the plan for building, deploying, and maintaining the property chatbot.

## Phase 1: Planning and Data Preparation

- [ ] **Define Chatbot Scope:** Finalize the specific goals and limitations of the chatbot.
- [ ] **Gather Data:** Collect all relevant documents, including:
    - [ ] Property brochures
    - [ ] Price lists
    - [ ] Technical specifications
    - [ ] Facility information
    - [ ] Purchase procedures and KPR info
    - [ ] Company profile
- [ ] **Structure Data:** Convert all documents into a clean, text-based format (e.g., .txt or Markdown).

## Phase 2: Technology and Architecture

- [x] **Architecture:** RAG (Retrieval-Augmented Generation)
- [x] **Language:** Python
- [x] **AI Framework:** LangChain
- [x] **LLM:** Google Gemini
- [x] **Vector Database:** ChromaDB
- [x] **Backend Framework:** FastAPI

## Phase 3: Development

- [ ] **Setup Project:** Initialize a new Python project with FastAPI.
- [ ] **Data Indexing Script:**
    - [ ] Implement data loading from the `data` directory.
    - [ ] Implement text chunking.
    - [ ] Implement embedding generation using Google Gemini.
    - [ ] Implement indexing into ChromaDB.
- [ ] **Chatbot Logic:**
    - [ ] Create the core QA chain using LangChain.
    - [ ] Implement the retrieval mechanism from ChromaDB.
    - [ ] Implement the generation step using Google Gemini.
- [ ] **API Development:**
    - [ ] Create a `/ask` endpoint to receive user questions.
    - [ ] Integrate the chatbot logic with the API endpoint.

## Phase 4: Deployment and Maintenance

- [ ] **Testing:**
    - [ ] Conduct internal testing with a variety of questions.
    - [ ] Identify and address any weaknesses or incorrect answers.
- [ ] **Deployment:**
    - [ ] Choose a cloud provider (e.g., Google Cloud Run, AWS).
    - [ ] Deploy the FastAPI application.
- [ ] **Website Integration:**
    - [ ] Develop a chat widget for the frontend.
    - [ ] Connect the widget to the deployed chatbot API.
- [ ] **Monitoring and Maintenance:**
    - [ ] Monitor logs for failed questions or errors.
    - [ ] Establish a process for regularly updating the knowledge base with new data.