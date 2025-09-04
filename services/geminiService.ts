
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = (file: File) => {
  return new Promise<{ mimeType: string; data: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as base64 string"));
      }
      const base64Data = reader.result.split(',')[1];
      resolve({
        mimeType: file.type,
        data: base64Data,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const extractWeightsFromImage = async (imageFile: File): Promise<number[]> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `
      Analyze the provided image of a poultry farm weight sheet.
      Extract all the individual weight numbers listed in the main grid or columns.
      Ignore any numbers that are clearly identifiers, dates, totals, subtotals, or not part of the primary weight entries.
      The numbers can be 3 or 4 digits long.
      Return ONLY the weights as a JSON object with a single key "weights" containing an array of numbers.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          { inlineData: imagePart },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weights: {
              type: Type.ARRAY,
              items: {
                type: Type.NUMBER,
              }
            }
          }
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && Array.isArray(result.weights)) {
      return result.weights.filter((w: any) => typeof w === 'number');
    }

    return [];
  } catch (error) {
    console.error("Error extracting weights from image:", error);
    throw new Error("Failed to analyze image with AI. Please check the console for details.");
  }
};
