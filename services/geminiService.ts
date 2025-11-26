import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TopicCategory, TopicCardData } from "../types";

const processApiKey = process.env.API_KEY;

if (!processApiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: processApiKey });

const topicSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A short, elegant title for the topic card (max 6 chars).",
    },
    description: {
      type: Type.STRING,
      description: "A brief, poetic or intriguing context for the topic.",
    },
    question: {
      type: Type.STRING,
      description: "The main question or activity instruction for the users.",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 short descriptive tags (e.g., 'Teamwork', 'Imagination').",
    },
    intensity: {
      type: Type.INTEGER,
      description: "A rating from 1 to 5 indicating emotional depth or energy required.",
    },
  },
  required: ["title", "description", "question", "tags", "intensity"],
};

export const generateTopic = async (category: TopicCategory, customContext?: string): Promise<TopicCardData> => {
  try {
    let basePrompt = "";
    
    if (category === TopicCategory.CUSTOM && customContext) {
        basePrompt = `Create a high-quality, engaging event topic card based specifically on this theme/keyword: "${customContext}".`;
    } else {
        basePrompt = `Create a high-quality, engaging event topic card for the category: "${category}".`;
    }

    const prompt = `${basePrompt} 
    The tone should be sophisticated, modern, and suitable for a social app. 
    Output strictly in Chinese (Simplified).
    Ensure the content is unique and not a generic cliché.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: topicSchema,
        temperature: 0.85, 
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }

    const data = JSON.parse(text) as TopicCardData;
    // Add client-side timestamp
    return { ...data, timestamp: Date.now() };

  } catch (error) {
    console.error("Error generating topic:", error);
    return {
      title: "静谧时刻",
      description: "连接似乎断开了，但我们可以享受当下的宁静。",
      question: "如果是你自己，现在最想去哪里旅行？",
      tags: ["Fallback", "Travel"],
      intensity: 1,
      timestamp: Date.now()
    };
  }
};