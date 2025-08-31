import ollama from "ollama";
import { ImageData } from "./image-utils";

export interface ModelResponse {
  success: boolean;
  response?: string;
  error?: string;
  model_used?: string;
}

export async function analyzeImageWithLLaVA(
  imageData: ImageData, 
  userPrompt: string
): Promise<string> {
  try {
    const prompt = `Please analyze this image and provide a detailed description. Context from user: ${userPrompt}`;
    
    const result = await ollama.chat({
      model: "llava:7b",
      messages: [
        {
          role: "user",
          content: prompt,
          images: [imageData.base64]
        }
      ]
    });

    return result.message.content;
  } catch (error) {
    console.error("Error with LLaVA analysis:", error);
    throw new Error(`Failed to analyze image with LLaVA: ${error}`);
  }
}

export async function generateResponseWithGemma(
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

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user", 
        content: userMessage
      }
    ];

    const result = await ollama.chat({
      model: "gemma3:4b",
      messages
    });

    return result.message.content;
  } catch (error) {
    console.error("Error with Gemma generation:", error);
    throw new Error(`Failed to generate response with Gemma: ${error}`);
  }
}

export async function orchestrateResponse(
  userInput: string,
  images: ImageData[],
  otherAttachments: { name: string; size: number; type: string }[]
): Promise<ModelResponse> {
  try {
    let imageAnalysis: string = "";
    
    if (images.length > 0) {
      console.log(`Processing ${images.length} image(s) with LLaVA:7b`);
      
      const analysisPromises = images.map(async (image, index) => {
        const analysis = await analyzeImageWithLLaVA(image, userInput);
        return `Image ${index + 1} (${image.fileName}): ${analysis}`;
      });
      
      const analyses = await Promise.all(analysisPromises);
      imageAnalysis = analyses.join("\n\n");
    }
    
    console.log("Generating response with Gemma3:4b");
    const finalResponse = await generateResponseWithGemma(
      userInput, 
      imageAnalysis || undefined,
      otherAttachments.length > 0 ? otherAttachments : undefined
    );
    
    const modelUsed = images.length > 0 ? "LLaVA:7b + Gemma3:4b" : "Gemma3:4b";
    
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
  const errors: string[] = [];
  let llava = false;
  let gemma = false;
  
  try {
    const models = await ollama.list();
    const modelNames = models.models.map(m => m.name);
    
    llava = modelNames.some(name => name.includes('llava') && name.includes('7b'));
    gemma = modelNames.some(name => name.includes('gemma3') && name.includes('4b'));
    
    if (!llava) {
      errors.push("LLaVA:7b model not found. Please run: ollama pull llava:7b");
    }
    if (!gemma) {
      errors.push("Gemma3:4b model not found. Please run: ollama pull gemma3:4b");
    }
    
  } catch (error) {
    errors.push(`Failed to check model availability: ${error}`);
  }
  
  return { llava, gemma, errors };
}
