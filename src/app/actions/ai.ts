"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSetting, SETTINGS_KEYS } from "@/lib/settings";

export async function generateTaskContent(theme: string, level: string) {
  const apiKey = await getSetting(SETTINGS_KEYS.GEMINI_API_KEY);

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in Settings");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using 'gemini-flash-latest' as recommended in reference project (Pulo do Gato 🐈)
  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  console.log("[AI] Generating content using gemini-flash-latest. Key length:", apiKey.length);

  const prompt = `
    You are an English Teacher for College students.
    Create a personalized English exercise task.
    
    Theme: ${theme}
    Student Level: ${level} (CEFR)
    
    Output Format: JSON with the following structure:
    {
      "title": "Title of the task",
      "introduction": "Brief intro relating the theme to English learning",
      "content": "A reading passage or scenario related to ${theme} suitable for ${level}",
      "questions": [
        { "question": "Question 1?", "options": ["a", "b", "c", "d"], "answer": "correct option" }
      ]
    }
    
    Ensure the language difficulty matches the ${level} level exactly.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Cleanup markdown code blocks if present
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate content");
  }
}
