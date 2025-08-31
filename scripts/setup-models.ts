import { checkModelAvailability } from "../lib/model-orchestrator";

async function setupModels() {
  console.log(" Checking model availability...\n");
  
  const { llava, gemma, errors } = await checkModelAvailability();
  
  if (errors.length > 0) {
    console.log("\n Installation Required:");
    errors.forEach(error => console.log(`   ${error}`));
    
    console.log("\n To install missing models, run:");
    if (!llava) {
      console.log("   ollama pull llava:7b");
    }
    if (!gemma) {
      console.log("   ollama pull gemma3:4b");
    }
    
    console.log("\n After installation, restart your development server:");
    console.log("   npm run dev");
  } else {
    console.log("\n All models are available! Your multimodal system is ready.");
    console.log("\n Usage:");
    console.log("   • Text only: Gemma3:4b handles the response");
    console.log("   • Text + Images: LLaVA:7b analyzes images → Gemma3:4b generates final response");
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupModels().catch(console.error);
}

export { setupModels };
