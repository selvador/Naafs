
import { GoogleGenAI, Content, Part } from "@google/genai";
import { ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION_BASE = `
You are "Nafs", a compassionate, empathetic, and wise mental health companion. 
The name "Nafs" refers to the self or soul. Your goal is to help the user find balance, 
peace, and healing.

Guidelines:
1. Be a deeply active listener. Validate feelings before offering advice.
2. Use a warm, calming, and non-judgmental tone.
3. Offer grounding techniques (breathing, mindfulness) when the user is stressed.
4. Provide short, wise reflections based on Stoicism, CBT, or general mindfulness.
5. IMPORTANT: You are NOT a licensed therapist. If the user mentions self-harm or suicide, 
   gently urge them to seek professional help and provide general emergency resource mentions.
6. Keep responses concise but meaningful.
`;

export const streamChatResponse = async (
  history: ChatMessage[], 
  newMessage: string,
  onChunk: (text: string) => void,
  language: string = 'en'
): Promise<string> => {
  
  try {
    // Transform history to Gemini format
    const contents: Content[] = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }] as Part[]
    }));

    // Add new message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }] as Part[]
    });
    
    const langInstruction = language === 'ar' ? "Reply in Arabic." : (language === 'fr' ? "Reply in French." : "Reply in English.");
    const finalSystemInstruction = `${SYSTEM_INSTRUCTION_BASE}\n\nIMPORTANT: ${langInstruction}`;

    const result = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: finalSystemInstruction,
        temperature: 0.7,
      }
    });

    let fullText = '';
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const generateInsight = async (journalText: string, language: string = 'en'): Promise<string> => {
  try {
    const langInstruction = language === 'ar' ? "in Arabic" : (language === 'fr' ? "in French" : "in English");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Read this journal entry and provide a very short (1-2 sentences) empathetic insight or gentle encouraging takeaway for the writer ${langInstruction}.\n\nEntry: "${journalText}"`,
    });
    return response.text || "Reflect on this feeling with kindness.";
  } catch (error) {
    console.error("Insight Error:", error);
    return "Unable to generate insight at this moment.";
  }
};

export const generateMeditation = async (mood: string, language: string = 'en'): Promise<string> => {
  try {
    const langInstruction = language === 'ar' ? "in Arabic" : (language === 'fr' ? "in French" : "in English");
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a very short (3 steps), calming micro-meditation for someone feeling ${mood}. Reply ${langInstruction}.`,
    });
    return response.text || "Breathe in deeply. Hold. Exhale slowly.";
  } catch (error) {
    return "Focus on your breath. Inhale peace, exhale tension.";
  }
};
