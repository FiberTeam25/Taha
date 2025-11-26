import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AiExtractionResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractCertificateDetails = async (prompt: string): Promise<AiExtractionResponse> => {
  try {
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