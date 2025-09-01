import ollama from "ollama";
import { BaseModelProvider, ModelMessage, ModelResponse, ModelAvailability } from "./base-provider";
import { ImageData } from "../image-utils";
import { ModelConfig } from "../model-config";

export class OllamaProvider extends BaseModelProvider {
  name: string;
  private config: ModelConfig;
  private ollamaClient: typeof ollama;

  constructor(config: ModelConfig) {
    super();
    this.config = config;
    this.name = config.description;
    
    // Use local Ollama client only
    this.ollamaClient = ollama;
  }

  async checkAvailability(): Promise<ModelAvailability> {
    const errors: string[] = [];
    let textModel = false;
    let visionModel = false;
    
    try {
      const models = await this.ollamaClient.list();
      const modelNames = models.models.map(m => m.name);
      
      visionModel = modelNames.some(name => 
        name.includes('llava') && name.includes('7b')
      );
      textModel = modelNames.some(name => 
        name.includes('gemma3') && name.includes('4b')
      );
      
      if (!visionModel) {
        errors.push(`LLaVA:7b model not found. Run: ollama pull llava:7b`);
      }
      if (!textModel) {
        errors.push(`Gemma3:4b model not found. Run: ollama pull gemma3:4b`);
      }
      
    } catch (error) {
      errors.push(`Failed to connect to local Ollama instance: ${error}`);
    }
    
    return { textModel, visionModel, errors };
  }

  async generateText(messages: ModelMessage[]): Promise<ModelResponse> {
    try {
      const ollamaMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        ...(msg.images && { images: msg.images })
      }));

      const result = await this.ollamaClient.chat({
        model: this.config.textModel,
        messages: ollamaMessages
      });

      return {
        success: true,
        content: result.message.content,
        model_used: `${this.config.textModel} (${this.name})`
      };
    } catch (error) {
      return {
        success: false,
        error: `Ollama text generation failed: ${error}`,
        model_used: this.config.textModel
      };
    }
  }

  async analyzeImage(imageData: ImageData, prompt: string): Promise<ModelResponse> {
    try {
      const fullPrompt = `Please analyze this image and provide a detailed description. Context from user: ${prompt}`;
      
      const result = await this.ollamaClient.chat({
        model: this.config.visionModel,
        messages: [
          {
            role: "user",
            content: fullPrompt,
            images: [imageData.base64]
          }
        ]
      });

      return {
        success: true,
        content: result.message.content,
        model_used: `${this.config.visionModel} (${this.name})`
      };
    } catch (error) {
      return {
        success: false,
        error: `Ollama image analysis failed: ${error}`,
        model_used: this.config.visionModel
      };
    }
  }
}
