import { NextRequest, NextResponse } from "next/server";
import { orchestrateResponse, checkModelAvailability } from "../../../lib/model-orchestrator";
import { ImageData, isValidImageFormat } from "../../../lib/image-utils";
import { getModelConfig, isProviderConfigured } from "../../../lib/model-config";

export async function POST(request: NextRequest) {
  try {
    const { userInput, images, attachments } = await request.json();
    
    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json(
        { success: false, error: "User input is required" },
        { status: 400 }
      );
    }
    
    const processedImages: ImageData[] = [];
    if (images && Array.isArray(images)) {
      for (const imageData of images) {
        if (!isValidImageFormat(imageData.mimeType)) {
          console.warn(`Unsupported image format: ${imageData.mimeType}`);
          continue;
        }
        processedImages.push(imageData);
      }
    }
    
    const otherAttachments = attachments || [];
    
    // Check model configuration and availability
    const config = getModelConfig();
    console.log(`API: Using provider ${config.provider}`);
    console.log('API: Full config:', JSON.stringify(config, null, 2));
    console.log('API: Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      NETLIFY: process.env.NETLIFY,
      OLLAMA_API_URL: !!process.env.OLLAMA_API_URL,
      MODEL_PROVIDER: process.env.MODEL_PROVIDER
    });
    
    if (!isProviderConfigured(config)) {
      console.error(`API: Provider ${config.provider} is not configured`);
      return NextResponse.json(
        { 
          success: false, 
          error: `${config.provider} provider is not properly configured. Please check your API keys and environment variables.` 
        },
        { status: 503 }
      );
    }
    
    const modelCheck = await checkModelAvailability();
    if (modelCheck.errors.length > 0) {
      console.warn("Model availability issues:", modelCheck.errors);
      // For cloud providers, we may still proceed if there are warnings
      // but fail if no models are available at all
      if (!modelCheck.gemma && !modelCheck.llava) {
        return NextResponse.json(
          { 
            success: false, 
            error: `No models available. Issues: ${modelCheck.errors.join(', ')}` 
          },
          { status: 503 }
        );
      }
      
      // If we have images but no vision model, inform the user
      if (processedImages.length > 0 && !modelCheck.llava) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Vision model not available for image analysis. Issues: ${modelCheck.errors.join(', ')}` 
          },
          { status: 503 }
        );
      }
    }
    
    const result = await orchestrateResponse(
      userInput,
      processedImages,
      otherAttachments
    );
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || "Failed to generate response" 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      response: result.response,
      model_used: result.model_used
    });
    
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to generate AI response" 
      },
      { status: 500 }
    );
  }
}
