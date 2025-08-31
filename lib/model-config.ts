export type ModelProvider = 'ollama-local' | 'ollama-remote';

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

// Default configurations for Ollama providers
export const PROVIDER_CONFIGS: ProviderConfig = {
  'ollama-local': {
    provider: 'ollama-local',
    textModel: 'gemma3:4b',
    visionModel: 'llava:7b',
    description: 'Local Ollama instance'
  },
  'ollama-remote': {
    provider: 'ollama-remote',
    textModel: 'gemma3:4b',
    visionModel: 'llava:7b',
    apiUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
    description: 'Remote Ollama instance'
  }
};

// Environment-based provider selection
export function getModelProvider(): ModelProvider {
  // Check if remote Ollama URL is provided
  const remoteOllamaUrl = process.env.OLLAMA_API_URL;
  
  // Check if we're in a hosted environment (Vercel, Netlify, etc.)
  const isHosted = process.env.VERCEL || 
                   process.env.NETLIFY || 
                   process.env.NODE_ENV === 'production';
  
  // Allow manual override via environment variable
  const manualProvider = process.env.MODEL_PROVIDER as ModelProvider;
  if (manualProvider && PROVIDER_CONFIGS[manualProvider]) {
    return manualProvider;
  }
  
  // Use remote Ollama if URL is provided or if hosted
  if (remoteOllamaUrl || isHosted) {
    return 'ollama-remote';
  }
  
  // Default to local Ollama
  return 'ollama-local';
}

export function getModelConfig(): ModelConfig {
  const provider = getModelProvider();
  const config = { ...PROVIDER_CONFIGS[provider] };
  
  // Update remote URL if provided in environment
  if (provider === 'ollama-remote' && process.env.OLLAMA_API_URL) {
    config.apiUrl = process.env.OLLAMA_API_URL;
  }
  
  return config;
}

// Check if the current provider is properly configured
export function isProviderConfigured(config: ModelConfig): boolean {
  // Local Ollama doesn't need special configuration
  if (config.provider === 'ollama-local') {
    return true;
  }
  
  // Remote Ollama needs a URL
  if (config.provider === 'ollama-remote') {
    return !!config.apiUrl;
  }
  
  return false;
}
