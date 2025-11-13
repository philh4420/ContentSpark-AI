
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
// FIX: Add SocialPlatform to imports to resolve type error in refinePostText.
import type { PlatformConfig, Tone, UserProfile, SocialPlatform } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContentSchema = {
  type: Type.OBJECT,
  properties: {
    idea: {
        type: Type.STRING,
        description: 'A concise summary of the core idea or topic from the provided URL. This should be suitable for use as a history item title.'
    },
    imagePrompt: {
      type: Type.STRING,
      description: 'A detailed, visually rich prompt for an AI image generator to create a compelling, high-quality image that complements the social media posts. This should be a single, descriptive sentence.',
    },
    posts: {
      type: Type.ARRAY,
      description: 'An array of social media posts, one for each requested platform.',
      items: {
        type: Type.OBJECT,
        properties: {
          platform: {
            type: Type.STRING,
            description: 'The social media platform for which the post is tailored (e.g., "LinkedIn", "Twitter").',
          },
          text: {
            type: Type.STRING,
            description: 'The full text content of the social media post, tailored for the specified platform and tone. Include relevant hashtags.',
          },
        },
        required: ['platform', 'text'],
      },
    },
  },
  required: ['imagePrompt', 'posts', 'idea'],
};

export const generateSocialPosts = async (
  idea: string,
  platforms: PlatformConfig[],
  tone: Tone,
  userProfile: UserProfile,
  baseImage?: { data: string; mimeType: string; }
): Promise<GenerateContentResponse> => {

  const platformNames = platforms.map(p => p.name).join(', ');

  const systemInstruction = `You are ContentSpark AI, an expert social media content creator. Your task is to generate a cohesive set of social media posts and a corresponding image prompt based on a user's idea.

  **Instructions:**
  1.  **Analyze the User's Idea:** Understand the core message and goal.
  2.  **Incorporate Brand Profile:**
      -   **Brand Voice:** ${userProfile.brandVoice || 'Professional and engaging.'}
      -   **Target Audience:** ${userProfile.targetAudience || 'A general audience.'}
  3.  **Craft Platform-Specific Posts:**
      -   Generate one post for each of the following platforms: ${platformNames}.
      -   Tailor the content, length, and style for each platform's best practices.
      -   Apply the requested tone: **${tone}**.
      -   Include relevant hashtags.
  4.  **Create a Visually Rich Image Prompt:**
      -   Based on the user's idea, create a single, detailed, and descriptive prompt for an AI image generator (like Imagen).
      -   The prompt should describe a visually appealing, high-quality image that can be used across all the generated social media posts. Focus on a single, coherent scene.
      -   Example: "A photorealistic image of a majestic lion standing on a rock overlooking the savanna at sunset, with a warm, golden light."
  5.  **Adhere to the JSON Schema:** Format your entire response according to the provided JSON schema. For the 'idea' field, use the user's input directly.
  ${baseImage ? '6. **Analyze the Provided Image:** The user has provided an image. Your generated posts and image prompt should be relevant to, or build upon, the content of this image.' : ''}
  `;

  // FIX: Properly construct the multimodal contents array to avoid a TypeScript error.
  const contents: ({ text: string; } | { inlineData: { mimeType: string; data: string; }; })[] = [];

  if (baseImage) {
    contents.push({
        inlineData: {
            mimeType: baseImage.mimeType,
            data: baseImage.data,
        }
    });
  }
  
  contents.push({ text: `Generate social media posts for the following idea: "${idea}"` });


  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: { parts: contents },
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: { ...generateContentSchema, properties: { ...generateContentSchema.properties, idea: { type: Type.STRING, description: 'The user\'s original idea.' } } },
    },
  });

  return response;
};

export const generatePostContentFromUrl = async (
    url: string,
    platforms: PlatformConfig[],
    tone: Tone,
    userProfile: UserProfile
): Promise<GenerateContentResponse> => {
    const platformNames = platforms.map(p => p.name).join(', ');

    const systemInstruction = `You are ContentSpark AI, an expert social media content creator. Your task is to analyze the content of a provided URL using Google Search and generate a cohesive set of promotional social media posts.

    **Instructions:**
    1.  **Analyze the URL Content:** Use your tools to understand the main points, key takeaways, and overall topic of the content at the URL.
    2.  **Summarize the Core Idea:** Create a concise summary of the content. This summary will be used as the 'idea' field in the JSON response.
    3.  **Incorporate Brand Profile:**
        -   **Brand Voice:** ${userProfile.brandVoice || 'Professional and engaging.'}
        -   **Target Audience:** ${userProfile.targetAudience || 'A general audience.'}
    4.  **Craft Platform-Specific Promotional Posts:**
        -   Generate one post for each of the following platforms: ${platformNames}.
        -   Each post must summarize a key aspect of the URL's content and include a clear call-to-action to visit the link.
        -   Include the original URL (${url}) in each post.
        -   Apply the requested tone: **${tone}**.
        -   Include relevant hashtags.
    5.  **Create a Visually Rich Image Prompt:**
        -   Based on the URL's content, create a single, detailed prompt for an AI image generator that visually represents the core topic.
    6.  **Adhere to the JSON Schema:** Format your entire response according to the provided JSON schema.
    `;
    
    return await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Please generate content based on the URL: ${url}`,
        config: {
            systemInstruction,
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: generateContentSchema,
        },
    });
};

const trendingTopicsSchema = {
    type: Type.OBJECT,
    properties: {
        topics: {
            type: Type.ARRAY,
            description: 'A list of 5-7 trending topics or content ideas.',
            items: { type: Type.STRING }
        }
    },
    required: ['topics']
};

export const getTrendingTopics = async (industry: string): Promise<string[]> => {
    const systemInstruction = `You are a market research and trend analyst AI. Your task is to generate a list of current, trending topics and content ideas relevant to a user's specified industry. Focus on topics that are recent, engaging, and suitable for social media content.`;
    const prompt = `Generate 5-7 trending content ideas for the "${industry}" industry.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: trendingTopicsSchema,
        }
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse.topics || [];
};


export const generateImage = async (
  prompt: string,
  aspectRatio: string,
): Promise<string> => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "4:3" | "3:4",
      outputMimeType: 'image/jpeg',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    return response.generatedImages[0].image.imageBytes;
  }
  throw new Error('Image generation failed.');
};


export const refinePostText = async (
    originalText: string,
    platform: SocialPlatform,
    refinementInstruction: string,
    userProfile: UserProfile
): Promise<string> => {
    const systemInstruction = `You are an expert social media copy editor. Your task is to refine a given social media post based on a user's instructions, while maintaining the brand's voice and targeting the right audience.
    
    **Brand Voice:** ${userProfile.brandVoice || 'Professional and engaging.'}
    **Target Audience:** ${userProfile.targetAudience || 'A general audience.'}
    **Platform:** ${platform}
    `;

    const contents = `Original post:
    ---
    ${originalText}
    ---
    
    Refinement instruction: "${refinementInstruction}"
    
    Please provide only the refined post text, without any introductory phrases or explanations.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction
        }
    });

    return response.text;
};
