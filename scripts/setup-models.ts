import { checkModelAvailability } from "../lib/model-orchestrator";
import { getModelConfig, getModelProvider, isProviderConfigured } from "../lib/model-config";

async function setupModels() {
  console.log("🔍 Checking model configuration and availability...\n");
  
  const config = getModelConfig();
  const provider = getModelProvider();
  
  console.log(`🔧 Current provider: ${provider}`);
  console.log("📋 Configuration:");
  console.log(`   Text Model: ${config.textModel}`);
  console.log(`   Vision Model: ${config.visionModel}`);
  console.log(`   API URL: ${config.apiUrl || 'N/A (local)'}`);
  console.log(`   Description: ${config.description}\n`);
  
  if (!isProviderConfigured(config)) {
    console.log("⚠️  Provider Configuration Issues:");
    if (provider === 'ollama-local') {
      console.log("   Local Ollama provider selected but may not be running.");
      console.log("   Make sure Ollama is installed and running: ollama serve");
    } else if (provider === 'ollama-remote') {
      console.log(`   Remote Ollama provider selected but URL not configured.`);
      console.log("   Set OLLAMA_API_URL in your environment variables.");
      console.log("   See .env.example for configuration examples.\n");
    }
  }
  
  const { llava, gemma, errors } = await checkModelAvailability();
  
  if (errors.length > 0) {
    console.log("⚠️  Model Availability Issues:");
    errors.forEach(error => console.log(`   ${error}`));
    
    if (provider === 'ollama-local') {
      console.log("\n💡 To install missing local Ollama models, run:");
      if (!llava) {
        console.log("   ollama pull llava:7b");
      }
      if (!gemma) {
        console.log("   ollama pull gemma3:4b");
      }
      console.log("\n   After installation, restart your development server:");
      console.log("   npm run dev");
    } else if (provider === 'ollama-remote') {
      console.log("\n💡 For remote Ollama:");
      console.log("   - Verify your remote Ollama server is running");
      console.log("   - Check that models are installed on the remote server");
      console.log("   - Ensure network connectivity to the remote server");
    }
    
    console.log("\n🔄 Fallback System:");
    console.log("   The app will automatically try alternative Ollama instances if available.");
    
  } else {
    console.log("✅ All models are available! Your multimodal system is ready.");
    console.log("\n📱 Usage:");
    console.log(`   • Text only: ${config.textModel} handles the response`);
    console.log(`   • Text + Images: ${config.visionModel} analyzes images -> ${config.textModel} generates final response`);
    const mode = provider === 'ollama-local' ? 'offline' : 'online';
    console.log(`\n🌍 Provider: ${provider} (${mode})`);
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupModels().catch(console.error);
}

export { setupModels };
