
import { GoogleGenAI, Type } from "@google/genai";
import { SlideData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCarouselContent(topic: string): Promise<Partial<SlideData>[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قم بإنشاء محتوى لكاروسيل احترافي باللغة العربية حول الموضوع التالي: "${topic}". 
      يجب أن يكون الأسلوب موجزاً، جذاباً، واحترافياً (SaaS style).
      أريد 5 شرائح متنوعة (هيرو، مميزات، إحصائيات، نصيحة، دعوة للعمل).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING, description: "نوع الشريحة: hero, grid, stat, feature, testimonial, cta" },
              title: { type: Type.STRING },
              subtitle: { type: Type.STRING },
              content: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              footer: { type: Type.STRING }
            },
            required: ["type", "title"]
          }
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error generating content:", error);
    return [];
  }
}
