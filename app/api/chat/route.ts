import { NextRequest, NextResponse } from "next/server";
import { orchestrateResponse, checkModelAvailability } from "../../../lib/model-orchestrator";
import { ImageData, isValidImageFormat } from "../../../lib/image-utils";

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
    
    const modelCheck = await checkModelAvailability();
    if (processedImages.length > 0 && !modelCheck.llava) {
      return NextResponse.json(
        { 
          success: false, 
          error: "LLaVA:7b model not available. Please install it with: ollama pull llava:7b" 
        },
        { status: 503 }
      );
    }
    if (!modelCheck.gemma) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Gemma3:4b model not available. Please install it with: ollama pull gemma3:4b" 
        },
        { status: 503 }
      );
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
