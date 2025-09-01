import { BaseModelProvider } from "./base-provider";
import { OllamaProvider } from "./ollama-provider";
import { MockProvider } from "./mock-provider";
import { ModelConfig, getModelConfig } from "../model-config";

export function createModelProvider(config?: ModelConfig): BaseModelProvider {
  const modelConfig = config || getModelConfig();
  
  switch (modelConfig.provider) {
    case 'ollama-local':
      return new OllamaProvider(modelConfig);
    case 'mock':
      return new MockProvider(modelConfig);
    default:
      throw new Error(`Unknown provider: ${modelConfig.provider}`);
  }
}

export async function createFallbackProvider(): Promise<BaseModelProvider> {
  const config = getModelConfig();
  
  try {
    const primaryProvider = createModelProvider(config);
    
    if (config.provider === 'mock') {
      console.log('Using mock provider');
      return primaryProvider;
    }
    
    if (config.provider === 'ollama-local') {
      const availability = await primaryProvider.checkAvailability();
      
      // If ollama-local has issues, fallback to mock
      if (availability.errors.length > 0) {
        console.warn(`Ollama local not available:`, availability.errors);
        console.log('Falling back to mock provider');
        
        const mockConfig: ModelConfig = {
          provider: 'mock',
          textModel: 'Mock Legal AI',
          visionModel: 'Mock Vision AI',
          description: 'Mock AI for demo/testing'
        };
        
        return createModelProvider(mockConfig);
      }
    }
    
    return primaryProvider;
  } catch (error) {
    console.error("Failed to create model provider:", error);
    throw error;
  }
}
