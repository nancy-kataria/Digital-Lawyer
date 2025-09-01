export type ModelProvider = 'ollama-local' | 'mock';

export interface ModelConfig {
  provider: ModelProvider;
  textModel: string;
  visionModel: string;
  apiUrl?: string;
  description: string;
}

export interface ProviderConfig {
  [key: string]: ModelConfig;
}

// Default configurations for providers
export const PROVIDER_CONFIGS: ProviderConfig = {
  'ollama-local': {
    provider: 'ollama-local',
    textModel: 'gemma3:4b',
    visionModel: 'llava:7b',
    description: 'Local Ollama instance'
  },
  'mock': {
    provider: 'mock',
    textModel: 'Mock Legal AI',
    visionModel: 'Mock Vision AI',
    description: 'Mock AI for demo/testing'
  }
};

// Environment-based provider selection
export function getModelProvider(): ModelProvider {
  // Check if we're in a hosted environment (Vercel, Netlify, etc.)
  const isHosted = process.env.VERCEL || 
                   process.env.NETLIFY || 
                   process.env.NODE_ENV === 'production';
  
  // Allow manual override via environment variable
  const manualProvider = process.env.MODEL_PROVIDER as ModelProvider;
  if (manualProvider && PROVIDER_CONFIGS[manualProvider]) {
    return manualProvider;
  }
  
  // Use mock mode for hosted environments
  if (isHosted) {
    return 'mock';
  }
  
  // Default to local Ollama for development
  return 'ollama-local';
}

export function getModelConfig(): ModelConfig {
  const provider = getModelProvider();
  const config = { ...PROVIDER_CONFIGS[provider] };
  
  return config;
}

// Check if the current provider is properly configured
export function isProviderConfigured(config: ModelConfig): boolean {
  // Local Ollama doesn't need special configuration
  if (config.provider === 'ollama-local') {
    return true;
  }
  
  // Mock provider is always configured
  if (config.provider === 'mock') {
    return true;
  }
  
  return false;
}
