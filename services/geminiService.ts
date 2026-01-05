
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

/**
 * Advanced Neural Analysis: Detects brand essence and crafts a complex 3D panoramic scene.
 */
export async function analyzeScreenshot(base64Image: string): Promise<AIAnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: `Act as a world-class App Store Creative Director. 
            Analyze this UI carefully. 
            1. Identify the exact app category (Finance, Travel, Fitness, etc.).
            2. Extract a sophisticated brand color palette (Primary, Secondary, Accent).
            3. Generate 5 hyper-converting marketing headlines.
            4. Design a 'Neural Scene Directive' for a 3D Panoramic Background:
               - It must be a wide-angle environment.
               - Describe specific 3D high-fidelity assets related to the niche (e.g., 'Floating 3D frosted glass credit cards with gold edges', 'Lush 3D hyper-detailed tropical plants with dew drops', 'Glossy 3D isometric crypto tokens').
               - Specify 'Cinematic Rim Lighting' and 'Distributed Depth' so objects appear across the entire 16:9 width.
            Return as strict JSON.`,
          },
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image.split(",")[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          colors: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          suggestedCaptions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                subtitle: { type: Type.STRING },
              },
            },
          },
          styleRecommendation: {
            type: Type.STRING,
          },
          scenePrompt: {
            type: Type.STRING,
          },
        },
        required: ["colors", "suggestedCaptions", "styleRecommendation", "scenePrompt"],
      },
    },
  });

  try {
    const resultText = response.text || "{}";
    // Sanitize in case of markdown blocks
    const cleanJson = resultText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson) as AIAnalysisResult;
  } catch (e) {
    console.error("JSON Parse Error:", e);
    throw new Error("AI returned invalid data format. Please try again.");
  }
}

/**
 * Elite 3D Image Engine: Produces distributed panoramic assets.
 */
export async function generateAIBackground(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `Professional 16:9 8K Cinematic 3D Marketing Background.
          SCENE: ${prompt}.
          AESTHETIC: High-end Octane Render, Ray-traced shadows, Volumetric atmosphere, Subsurface scattering on all 3D assets.
          COMPOSITION RULES:
          - No centered focal point.
          - Spread 3D objects and visual interest UNIFORMLY from the far left edge to the far right edge.
          - Use a wide-angle 14mm lens perspective for maximum panoramic flow.
          - Depth of field: sharp foreground/middle, soft blurred background.
          - Purely abstract and environmental. No text, no people, no screens.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Neural Imaging system failed to return an asset.");
}
