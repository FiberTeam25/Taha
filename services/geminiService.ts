import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AiExtractionResponse } from '../types';

export const extractCertificateDetails = async (prompt: string): Promise<AiExtractionResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        recipientName: { type: Type.STRING, description: "Name of the person receiving the certificate" },
        title: { type: Type.STRING, description: "Title of the certificate (e.g., Certificate of Achievement, Diploma)" },
        description: { type: Type.STRING, description: "A short paragraph describing why the certificate is awarded" },
        date: { type: Type.STRING, description: "The date formatted as a string (e.g., October 24, 2023)" },
        issuerName: { type: Type.STRING, description: "Name of the organization or person issuing the certificate" },
        issuerTitle: { type: Type.STRING, description: "Title of the issuer (e.g., Director, Instructor)" },
        companyName: { type: Type.STRING, description: "Name of the company or organization issuing the certificate" },
      },
      required: ["title", "description"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract certificate details from the following user request. If a field is missing, imply a reasonable default or leave it empty, but try to be helpful. User Request: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert administrative assistant helping to draft professional certificates. Ensure the tone is formal and celebratory.",
      },
    });

    const text = response.text;
    if (!text) return {};
    
    return JSON.parse(text) as AiExtractionResponse;
  } catch (error) {
    console.error("Gemini extraction failed:", error);
    throw error;
  }
};

export const generateCertificateLogo = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
  try {
    // Ensure API Key is selected for Veo/Image models
    if (typeof window !== 'undefined' && window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
    }

    // Create a new instance to ensure the latest API key is used
    const imageAi = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await imageAi.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: '1:1', // Logos are typically square
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned from API");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};