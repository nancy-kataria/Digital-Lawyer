import { BaseModelProvider } from "./base-provider";
import { OllamaProvider } from "./ollama-provider";
import { ModelConfig, getModelConfig } from "../model-config";

export function createModelProvider(config?: ModelConfig): BaseModelProvider {
  const modelConfig = config || getModelConfig();
  
  switch (modelConfig.provider) {
    case 'ollama-local':
    case 'ollama-remote':
      return new OllamaProvider(modelConfig);
    default:
      throw new Error(`Unknown provider: ${modelConfig.provider}`);
  }
}

// Fallback logic - try remote Ollama if local fails, or vice versa
export async function createFallbackProvider(): Promise<BaseModelProvider> {
  const config = getModelConfig();
  
  try {
    const primaryProvider = createModelProvider(config);
    const availability = await primaryProvider.checkAvailability();
    
    // If primary provider is not available, try fallback
    if (availability.errors.length > 0) {
      console.warn(`Primary provider ${config.provider} not available:`, availability.errors);
      
      // Switch between local and remote Ollama
      const fallbackProvider = config.provider === 'ollama-local' ? 'ollama-remote' : 'ollama-local';
      
      // Only attempt fallback if the fallback provider is configured
      if (fallbackProvider === 'ollama-remote' && !process.env.OLLAMA_API_URL) {
        console.warn("Cannot fallback to remote Ollama: OLLAMA_API_URL not configured");
        return primaryProvider; // Return primary even if it has issues
      }
      
      const fallbackConfig: ModelConfig = { 
        ...config, 
        provider: fallbackProvider,
        description: fallbackProvider === 'ollama-local' ? 'Local Ollama instance' : 'Remote Ollama instance',
        apiUrl: fallbackProvider === 'ollama-remote' 
          ? (process.env.OLLAMA_API_URL || 'http://localhost:11434')
          : undefined
      };
      
      console.log(`Attempting fallback to ${fallbackProvider}`);
      return createModelProvider(fallbackConfig);
    }
    
    return primaryProvider;
  } catch (error) {
    console.error("Failed to create model provider:", error);
    throw error;
  }
}
