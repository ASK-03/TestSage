import { GoogleGenerativeAI } from "@google/generative-ai";

declare global {
  var genAI: GoogleGenerativeAI | undefined;
}

const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY === undefined) {
  throw new Error("GEMINI_API_KEY is not defined");
}

export const genAI = globalThis.genAI || new GoogleGenerativeAI(API_KEY);

if (process.env.NODE_ENV !== "production") globalThis.genAI = genAI;

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model;
