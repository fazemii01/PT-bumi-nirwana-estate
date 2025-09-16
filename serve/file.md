# How the Chatbot Answers a Question

This document explains the step-by-step journey of a user's question, from the moment it's sent to the server until a final answer is returned. The entire process is designed to be smart, context-aware, and accurate.

The core of our chatbot is a system called **Retrieval-Augmented Generation (RAG)**. In simple terms, instead of just making up an answer, the AI first *retrieves* relevant information from our knowledge base (documents, images, etc.) and then *generates* an answer based on that information.

Let's follow a user's question: **"Berapa DP untuk tipe 45?"** (What is the down payment for type 45?)

---

### Step 1: The Question Arrives

When the user sends their message, the server's `ChatService` receives it.

1.  **Check Knowledge**: The service first makes sure it has access to its knowledge base (the vector store).
2.  **Get History**: It retrieves the past conversation history for this specific user. This is important for understanding follow-up questions (e.g., if the user later asks "how about for 10 years?").

---

### Step 2: The "Master Chain" Decides What to Do

The user's question is sent to a "Master Chain," which acts like a smart router.

*   **Is it a simple greeting?** (like "Hi" or "Hello"). If yes, it sends a simple greeting back.
*   **Is it a real question?** If yes (which our example is), it passes the question to the main RAG (Retrieval-Augmented Generation) chain for processing.

---

### Step 3: The RAG Chain - Finding and Creating the Answer

This is where the magic happens. The RAG chain follows a sequence of steps to build the best possible answer.

#### A. Understand the Real Question (History-Aware Retrieval)

The system first looks at the chat history to see if the user's new message is a follow-up. It uses an AI model to rephrase the question into a complete, standalone query.

*   **User asks:** "how about for 10 years?"
*   **AI rephrases to:** "What is the down payment for type 45 for 10 years?"

Since our example is the first question, the query remains the same: `"Berapa DP untuk tipe 45?"`.

#### B. Find All Possible Information (Multi-Query Retrieval)

One way of phrasing a question might not be enough to find the best documents. So, the system uses an AI to generate several different versions of the question.

*   **Original:** "Berapa DP untuk tipe 45?"
*   **AI-Generated Variations:**
    *   `harga uang muka untuk properti tipe 45`
    *   `persyaratan cicilan untuk rumah tipe 45`
    *   `detail pembayaran DP properti tipe 45`

The system then searches the knowledge base (our Weaviate vector store) for documents relevant to **all** of these questions at the same time. This "wider net" approach helps ensure we don't miss any important information.

#### C. Pick Only the Best Information (Reranking)

The search in the previous step might return a lot of documents, some more relevant than others. To fix this, we use a specialized **reranker** model.

The reranker takes the original question and the list of found documents and re-scores them based on true relevance. It then throws away everything except the **top 5 most relevant documents**.

This step is critical because it filters out noise and gives the final AI model only the highest-quality information to work with.

#### D. Generate the Final Answer (Synthesis)

The system now has everything it needs:

*   The user's original question.
*   The conversation history.
*   The top 5 most relevant document snippets.

It combines all of this into a final prompt for the AI model, with a very important instruction: **"You are a property assistant. Answer the user's question ONLY using the information provided in the context documents."**

This instruction forces the AI to be a helpful assistant that sticks to the facts from our documents, preventing it from making things up. The AI then generates the final, human-readable answer.

**Example Answer:** `"Untuk tipe 45, uang muka (DP) adalah Rp 25.000.000."`

---

### Step 4: Finishing Up

1.  **Update History**: The user's question and the AI's answer are saved to the conversation history for next time.
2.  **Send Response**: The final answer is sent back to the user's screen.

And that's the complete journey! This multi-step process ensures the chatbot is not only conversational but also accurate and grounded in our specific knowledge.