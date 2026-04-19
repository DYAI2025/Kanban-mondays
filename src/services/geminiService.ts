import { GoogleGenAI } from "@google/genai";
import { Workshop } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = "gemini-3-flash-preview";

export interface CopilotResponse {
  critique: string;
  recommendations: string[];
  suggestedDraft?: any;
  flags: { type: 'red' | 'yellow' | 'green', message: string }[];
}

export async function getCopilotFeedback(workshop: Workshop, currentStep: string): Promise<CopilotResponse> {
  const prompt = `You are an expert Workshop Product Architect. Your goal is to help build "Monday-Ready Framework Kickoffs".
  These are high-impact workshops that get teams working by Day 3.
  
  Current Workshop Data: ${JSON.stringify(workshop)}
  Current Step being edited: ${currentStep}
  
  Reference Standard (Kanban Kickoff): Focused on operational outcome, hard scope boundaries, concrete Day-3 artifacts.
  
  Provide a critique of the current state of this step. 
  Is it too "educational" (bad) or truly "operational" (good)?
  Are there gaps? 
  Are the boundaries sharp?
  
  Return your response as JSON with the following structure:
  {
    "critique": "string",
    "recommendations": ["string"],
    "suggestedDraft": {},
    "flags": [{"type": "red" | "yellow" | "green", "message": "string"}]
  }`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || '{}') as CopilotResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      critique: "I'm having trouble connecting right now. Please focus on Day-3 applicability and concrete artifacts.",
      recommendations: ["Ensure your Day-3 outcome is a 'can-do' state, not just 'knowledge'."],
      flags: [{ type: 'yellow', message: 'AI Copilot offline - using fallback heuristics.' }]
    };
  }
}

export async function analyzeMaturity(workshop: Workshop): Promise<Partial<Workshop['maturityScores']>> {
    const prompt = `Analyze the following Workshop product specification and provide a maturity score across multiple dimensions.
    Workshop: ${JSON.stringify(workshop)}
    
    Dimensions: Outcome Clarity, Audience Fit, Scope Boundaries, Delivery Architecture, Signature Methods, Portfolio Connectivity.
    
    Return a JSON object:
    {
      "overallScore": number (0-100),
      "familyFitScore": number (0-100),
      "categoryScores": {
        "outcome": {"score": number, "status": "red"|"yellow"|"green", "reason": "string", "nextStep": "string"},
        ... (for all 12 categories in types.ts MaturityScoreCategory)
      },
      "redFlags": ["string"]
    }`;

    try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
    
        return JSON.parse(response.text || '{}');
      } catch (error) {
        return {
           overallScore: 50,
           redFlags: ['Manual scoring required']
        };
      }
}

export async function summarizeContent(content: string, type: 'workshop' | 'asset' | 'documentation'): Promise<string> {
    const prompt = `Provide a concise, executive summary of the following ${type}. 
    Focus on the core value proposition, key outcomes, and target audience. 
    Keep it under 150 words. Use a professional, bold tone.
    
    Content:
    ${content}`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text || "Summary unavailable.";
    } catch (error) {
        console.error("Summarization Error:", error);
        return "Could not generate summary at this time.";
    }
}
