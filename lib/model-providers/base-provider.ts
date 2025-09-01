import { ImageData } from "../image-utils";

export interface ModelMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  images?: string[]; // base64 encoded images
}

export interface ModelResponse {
  success: boolean;
  content?: string;
  error?: string;
  model_used?: string;
}

export interface ModelAvailability {
  textModel: boolean;
  visionModel: boolean;
  errors: string[];
}

export abstract class BaseModelProvider {
  abstract name: string;
  
  abstract checkAvailability(): Promise<ModelAvailability>;
  
  abstract generateText(
    messages: ModelMessage[]
  ): Promise<ModelResponse>;
  
  abstract analyzeImage(
    imageData: ImageData,
    prompt: string
  ): Promise<ModelResponse>;

  protected formatImageForProvider(imageData: ImageData): string {
    return imageData.base64;
  }
}
