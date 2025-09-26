

import { GoogleGenAI, Type } from "@google/genai";
import type { YouTubePlan } from '../types';

// FIX: Removed the explicit check for process.env.API_KEY.
// The coding guidelines state to assume the API key is always available from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const planSchema = {
    type: Type.OBJECT,
    properties: {
        channelBranding: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                nameIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                taglineIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                visualIdentity: { type: Type.STRING },
            },
        },
        contentStrategy: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                contentPillars: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            pillar: { type: Type.STRING },
                            ideas: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                    },
                },
                videoFormats: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        },
        videoIdeas: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                ideas: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                    },
                },
            },
        },
        automationWorkflow: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                steps: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.STRING },
                            details: { type: Type.STRING },
                            tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                    },
                },
            },
        },
        socialMediaPromotion: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                twitterPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
                instagramCaptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                tiktokIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
                facebookPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
        },
        trafficGeneration: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                strategies: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            strategy: { type: Type.STRING },
                            details: { type: Type.STRING },
                        },
                    },
                },
            },
        },
        monetization: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                methods: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            method: { type: Type.STRING },
                            details: { type: Type.STRING },
                            cta: { type: Type.STRING },
                        },
                    },
                },
            },
        },
        merchandiseOfferings: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                products: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            product: { type: Type.STRING },
                            details: { type: Type.STRING },
                            fulfillment: { type: Type.STRING },
                        },
                    },
                },
            },
        },
    },
};

export const generateYouTubePlan = async (request: string): Promise<YouTubePlan> => {
    const prompt = `Analyze the following request for a new YouTube channel and generate a comprehensive business and content plan. The channel will focus on psychic abilities, tarot, art, and "witchy" topics. Provide actionable strategies for content, automation, traffic, and monetization. For each monetization method, also provide a specific, actionable call to action (CTA) that the creator can use in their videos. Generate a dedicated section with 5-7 specific, creative, and trend-aware video ideas, each with an engaging title and a brief description. Also generate a social media promotion plan with specific post ideas for Twitter, Instagram, TikTok, and Facebook to drive traffic to the YouTube channel. Finally, suggest a list of merchandise and sacred offerings the creator could sell. For each item, suggest a practical fulfillment method (e.g., 'Print-on-Demand' for custom tarot decks and art, 'Handmade', 'Dropshipping' for crystals).

    Request: "${request}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a world-class YouTube growth strategist and content automation expert. Your goal is to create a comprehensive, actionable plan for launching and growing a successful YouTube channel. The plan should be structured, detailed, and encouraging. Respond in the requested JSON format.",
                responseMimeType: "application/json",
                responseSchema: planSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedPlan = JSON.parse(jsonText) as YouTubePlan;
        
        return parsedPlan;

    } catch (error) {
        console.error("Error generating YouTube plan with Gemini:", error);
        if (error instanceof Error) {
            if (error.name === 'SyntaxError' || error.message.toLowerCase().includes('json')) {
                throw new Error("The AI's response was not in the expected format. This can be a temporary issue. Please try generating the plan again.");
            }
            if (error.message.toLowerCase().includes('api key')) {
                throw new Error("There is an issue with the AI service configuration. Please contact support.");
            }
            throw new Error("The digital oracle is currently unavailable. Please check your connection and try again in a few moments.");
        }
        throw new Error("An unknown error occurred while generating the plan. Please try again.");
    }
};