import { GoogleGenerativeAI } from "@google/generative-ai";

// Use a module-scoped variable to manage the instance
let genAIInstance: GoogleGenerativeAI | undefined;

const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY === undefined) {
  throw new Error("GEMINI_API_KEY is not defined");
}

// Initialize the GoogleGenerativeAI instance if not already done
const genAI = genAIInstance || new GoogleGenerativeAI(API_KEY);

if (process.env.NODE_ENV !== "production") {
  genAIInstance = genAI;
}

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;
