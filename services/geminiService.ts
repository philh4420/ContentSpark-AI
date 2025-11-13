
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
// FIX: Add SocialPlatform to imports to resolve type error in refinePostText.
import type { PlatformConfig, UserProfile, SocialPlatform, AdvancedToneProfile } from '../types';

// FIX: Use process.env.API_KEY, which is made available by the build process
// (via vite.config.js on Vercel). This provides a single, consistent way
// to access the API key across all environments.
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY is not set in the environment variables.");
}
const ai = new GoogleGenAI({ apiKey });

const postItemSchema = {
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
};

const imagePromptSchema = {
    type: Type.STRING,
    description: 'A detailed, visually rich prompt for an AI image generator to create a compelling, high-quality image that complements the social media posts. This should be a single, descriptive sentence.',
};

// Schema for generating posts from a simple text idea
const socialPostsSchema = {
  type: Type.OBJECT,
  properties: {
    imagePrompt: imagePromptSchema,
    posts: {
      type: Type.ARRAY,
      description: 'An array of social media posts, one for each requested platform.',
      items: postItemSchema,
    },
  },
  required: ['imagePrompt', 'posts'],
};

// Schema for generating posts by analyzing a URL
const urlContentSchema = {
  type: Type.OBJECT,
  properties: {
    idea: {
        type: Type.STRING,
        description: 'A concise summary of the core idea or topic from the provided URL. This should be suitable for use as a history item title.'
    },
    imagePrompt: imagePromptSchema,
    posts: {
      type: Type.ARRAY,
      description: 'An array of social media posts, one for each requested platform.',
      items: postItemSchema,
    },
  },
  required: ['imagePrompt', 'posts', 'idea'],
};


export const generateSocialPosts = async (
  idea: string,
  platforms: PlatformConfig[],
  tone: AdvancedToneProfile,
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
  3.  **Apply the Advanced Tone Profile:** Blend the following tonal qualities based on a 0-100 scale:
      -   **Formality: ${tone.formality}/100** (0 is very casual, 100 is very formal).
      -   **Humor: ${tone.humor}/100** (0 is serious, 100 is very witty).
      -   **Urgency: ${tone.urgency}/100** (0 is patient, 100 is highly urgent).
      -   **Enthusiasm: ${tone.enthusiasm}/100** (0 is reserved, 100 is highly enthusiastic).
  4.  **Craft Platform-Specific Posts:**
      -   Generate one post for each of the following platforms: ${platformNames}.
      -   Tailor the content, length, and style for each platform's best practices, infused with the tone profile above.
      -   Include relevant hashtags.
  5.  **Create a Visually Rich Image Prompt:**
      -   Based on the user's idea, create a single, detailed, and descriptive prompt for an AI image generator (like Imagen).
      -   The prompt should describe a visually appealing, high-quality image that can be used across all the generated social media posts. Focus on a single, coherent scene.
  6.  **Adhere to the JSON Schema:** Format your entire response according to the provided JSON schema.
  ${baseImage ? '7. **Analyze the Provided Image:** The user has provided an image. Your generated posts and image prompt should be relevant to, or build upon, the content of this image.' : ''}
  `;

  const contents = {
    parts: [
      baseImage ? { inlineData: { mimeType: baseImage.mimeType, data: baseImage.data } } : null,
      { text: `Generate content for this idea: "${idea}"` }
    ].filter(Boolean) as any[]
  };
  
  return ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: contents.parts },
    config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: socialPostsSchema,
    }
  });
};

export const generatePostContentFromUrl = (
  url: string,
  platforms: PlatformConfig[],
  tone: AdvancedToneProfile,
  userProfile: UserProfile,
): Promise<GenerateContentResponse> => {
    const platformNames = platforms.map(p => p.name).join(', ');

    const systemInstruction = `You are ContentSpark AI, a web content analyst and social media expert. Your task is to analyze the provided URL using Google Search and generate social media content.

    **Instructions:**
    1.  **Analyze the URL:** Fetch and understand the main content, topic, and key takeaways from the URL.
    2.  **Summarize the Core Idea:** Create a short, descriptive summary of the content. This will be used for the history log.
    3.  **Create an Image Prompt:** Based on the content, devise a single, detailed, and visually rich prompt for an AI image generator.
    4.  **Craft Platform-Specific Posts:**
        -   Generate one post for each of these platforms: ${platformNames}.
        -   Incorporate the user's brand profile:
            -   **Brand Voice:** ${userProfile.brandVoice || 'Professional and engaging.'}
            -   **Target Audience:** ${userProfile.targetAudience || 'A general audience.'}
        -   Apply the Advanced Tone Profile (blend the following on a 0-100 scale):
            -   **Formality: ${tone.formality}/100** (0=casual, 100=formal).
            -   **Humor: ${tone.humor}/100** (0=serious, 100=witty).
            -   **Urgency: ${tone.urgency}/100** (0=patient, 100=urgent).
            -   **Enthusiasm: ${tone.enthusiasm}/100** (0=reserved, 100=enthusiastic).
    5.  **Return a JSON Object:** You MUST format your entire response as a single, valid JSON object with the following structure: { "idea": "...", "imagePrompt": "...", "posts": [{ "platform": "...", "text": "..." }] }. Do not include any other text or markdown formatting outside of this JSON object.`;
    
    return ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Please generate content based on the article at this URL: ${url}`,
        config: {
            systemInstruction,
            tools: [{ googleSearch: {} }]
        },
    });
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            aspectRatio: aspectRatio,
            outputMimeType: 'image/jpeg',
        },
    });
    return response.generatedImages[0].image.imageBytes;
};


export const refinePostText = async (
    originalText: string,
    platform: SocialPlatform,
    refinement: string,
    userProfile: UserProfile
): Promise<string> => {
    const systemInstruction = `You are an expert social media editor. Your task is to refine a given social media post based on a user's instructions.

    **Brand Profile to Maintain:**
    -   **Brand Voice:** ${userProfile.brandVoice || 'Professional and engaging.'}
    -   **Target Audience:** ${userProfile.targetAudience || 'A general audience.'}
    
    **Task:**
    1.  Analyze the original post, its target platform (${platform}), and the user's refinement request.
    2.  Rewrite the post to incorporate the requested changes while maintaining the brand profile.
    3.  Return ONLY the refined text for the post. Do not include any explanations, preambles, or extra formatting.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Original Post: "${originalText}"\n\nRefinement Request: "${refinement}"`,
        config: { systemInstruction },
    });
    return response.text.trim();
};

export const getTrendingTopics = async (industry: string): Promise<string[]> => {
    const systemInstruction = `You are an AI research assistant specializing in identifying trending topics.
    Based on the user's specified industry or topic, use Google Search to find 5-7 current, highly relevant, and specific trending topics or news items.
    
    **Instructions:**
    1.  The topics should be concise and suitable for inspiring social media content.
    2.  Return your response as a valid JSON object with a single key "topics" which is an array of strings.
    3.  Example format: { "topics": ["Topic 1", "Topic 2", "Topic 3"] }
    4.  Do not include any text outside of the JSON object.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Industry: ${industry}`,
        config: {
            systemInstruction,
            tools: [{ googleSearch: {} }],
        }
    });

    try {
        let responseText = response.text.trim();
        const markdownMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (markdownMatch) {
            responseText = markdownMatch[1];
        }
        const jsonResponse = JSON.parse(responseText);
        return jsonResponse.topics || [];
    } catch (e) {
        console.error("Failed to parse trending topics:", e);
        // Fallback: Try to extract topics from plain text if JSON parsing fails
        return response.text.split('\n').map(s => s.replace(/^- /, '')).filter(Boolean);
    }
};
