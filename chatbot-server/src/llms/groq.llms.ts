import { ChatOpenAI } from "@langchain/openai";

const groqOpenAI = new ChatOpenAI({
  openAIApiKey: process.env.GROQ_API_KEY,
  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
  model: "llama-3.3-70b-versatile",
  temperature: 0.3,
});

export default groqOpenAI;
