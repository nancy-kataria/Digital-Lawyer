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

export function getModelProvider(): ModelProvider {
  const isHosted = process.env.VERCEL || 
                   process.env.NETLIFY || 
                   process.env.NODE_ENV === 'production';
  
  const manualProvider = process.env.MODEL_PROVIDER as ModelProvider;
  if (manualProvider && PROVIDER_CONFIGS[manualProvider]) {
    return manualProvider;
  }
  
  if (isHosted) {
    return 'mock';
  }
  return 'ollama-local';
}

export function getModelConfig(): ModelConfig {
  const provider = getModelProvider();
  const config = { ...PROVIDER_CONFIGS[provider] };
  
  return config;
}

export function isProviderConfigured(config: ModelConfig): boolean {
  if (config.provider === 'ollama-local') {
    return true;
  }
  
  if (config.provider === 'mock') {
    return true;
  }
  
  return false;
}
