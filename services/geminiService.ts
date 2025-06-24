
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_TEXT_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getGeminiResponse = async (prompt: string, language: string = "English"): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Please set the API_KEY environment variable.";
  }
  try {
    const systemInstruction = `You are a helpful assistant for a Viber bot. Please respond naturally in ${language}. Keep your answers concise and friendly.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
        }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `Error interacting with AI: ${error.message}`;
    }
    return "An unexpected error occurred while fetching AI response.";
  }
};

export const getGeminiJsonResponse = async <T,>(prompt: string, schemaExample?: T): Promise<T | null> => {
  if (!API_KEY) {
    console.error("API Key not configured.");
    return null;
  }
  try {
    let fullPrompt = prompt;
    if (schemaExample) {
        fullPrompt += `\n\nPlease provide the response in JSON format. For example: ${JSON.stringify(schemaExample, null, 2)}`;
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.5,
        }
    });
    
    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr) as T;
      return parsedData;
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", parseError, "Raw response:", jsonStr);
      return null;
    }

  } catch (error) {
    console.error("Error calling Gemini API for JSON:", error);
    return null;
  }
};
