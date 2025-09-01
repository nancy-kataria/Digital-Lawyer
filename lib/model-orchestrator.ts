import { ImageData } from "./image-utils";
import { createModelProvider, createFallbackProvider } from "./model-providers/provider-factory";
import { getModelConfig } from "./model-config";
import { BaseModelProvider, ModelMessage } from "./model-providers/base-provider";

export interface ModelResponse {
  success: boolean;
  response?: string;
  error?: string;
  model_used?: string;
}

let currentProvider: BaseModelProvider | null = null;

async function getProvider(): Promise<BaseModelProvider> {
  if (!currentProvider) {
    console.log('Orchestrator: Creating provider for the first time');
    const config = getModelConfig();
    console.log('Orchestrator: Config selected:', JSON.stringify(config, null, 2));
    currentProvider = await createFallbackProvider();
    console.log('Orchestrator: Provider created:', currentProvider.name);
  }
  return currentProvider;
}

export async function analyzeImageWithProvider(
  imageData: ImageData, 
  userPrompt: string
): Promise<string> {
  try {
    const provider = await getProvider();
    const result = await provider.analyzeImage(imageData, userPrompt);
    
    if (!result.success) {
      throw new Error(result.error || 'Image analysis failed');
    }
    
    return result.content || '';
  } catch (error) {
    console.error("Error with image analysis:", error);
    throw new Error(`Failed to analyze image: ${error}`);
  }
}

export async function generateResponseWithProvider(
  userInput: string, 
  imageAnalysis?: string,
  attachmentInfo?: { name: string; size: number; type: string }[]
): Promise<string> {
  try {
    let systemPrompt = "You are a helpful legal assistant AI. Provide general legal information and guidance, but always remind users to consult with a qualified attorney for specific legal advice. Be helpful, accurate, and professional. Please limit your responses to 2 or 3 paragraphs.";

    let userMessage = userInput;
    
    if (imageAnalysis) {
      systemPrompt += " You will receive image analysis from a vision model to help you provide more comprehensive responses.";
      userMessage = `User query: ${userInput}\n\nImage Analysis: ${imageAnalysis}\n\nPlease provide a comprehensive response considering both the user's text query and the image analysis.`;
    }
    
    if (attachmentInfo && attachmentInfo.length > 0) {
      userMessage += `\n\nNote: The user has also uploaded ${attachmentInfo.length} file(s): ${attachmentInfo.map(f => f.name).join(', ')}`;
    }

    const messages: ModelMessage[] = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user", 
        content: userMessage
      }
    ];

    const provider = await getProvider();
    const result = await provider.generateText(messages);
    
    if (!result.success) {
      throw new Error(result.error || 'Text generation failed');
    }

    return result.content || '';
  } catch (error) {
    console.error("Error with text generation:", error);
    throw new Error(`Failed to generate response: ${error}`);
  }
}

export const analyzeImageWithLLaVA = analyzeImageWithProvider;
export const generateResponseWithGemma = generateResponseWithProvider;

export async function orchestrateResponse(
  userInput: string,
  images: ImageData[],
  otherAttachments: { name: string; size: number; type: string }[]
): Promise<ModelResponse> {
  try {
    const provider = await getProvider();
    console.log(`Using provider: ${provider.name}`);
    
    let imageAnalysis: string = "";
    
    if (images.length > 0) {
      console.log(`Processing ${images.length} image(s) with vision model`);
      
      const analysisPromises = images.map(async (image, index) => {
        const analysis = await analyzeImageWithProvider(image, userInput);
        return `Image ${index + 1} (${image.fileName}): ${analysis}`;
      });
      
      const analyses = await Promise.all(analysisPromises);
      imageAnalysis = analyses.join("\n\n");
    }
    
    console.log("Generating response with text model");
    const finalResponse = await generateResponseWithProvider(
      userInput, 
      imageAnalysis || undefined,
      otherAttachments.length > 0 ? otherAttachments : undefined
    );
    
    const modelUsed = images.length > 0 ? 
      `${provider.name} (Vision + Text)` : 
      `${provider.name} (Text)`;
    
    return {
      success: true,
      response: finalResponse,
      model_used: modelUsed
    };
    
  } catch (error) {
    console.error("Error in model orchestration:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

export async function checkModelAvailability(): Promise<{
  llava: boolean;
  gemma: boolean;
  errors: string[];
}> {
  try {
    const provider = await getProvider();
    const availability = await provider.checkAvailability();
    
    return {
      llava: availability.visionModel,
      gemma: availability.textModel,
      errors: availability.errors
    };
  } catch (error) {
    return {
      llava: false,
      gemma: false,
      errors: [`Failed to check model availability: ${error}`]
    };
  }
}
