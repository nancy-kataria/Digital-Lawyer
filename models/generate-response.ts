import { processAttachments, ImageData } from "../lib/image-utils";

export async function generateLegalResponse(userInput: string, attachments?: File[]): Promise<string> {
  const startTime = Date.now();

  try {
    let images: ImageData[] = [];
    let otherFiles: { name: string; size: number; type: string }[] = [];
    
    if (attachments && attachments.length > 0) {
      const processed = await processAttachments(attachments);
      images = processed.images;
      otherFiles = processed.otherFiles;
      
      console.log(`Processed ${images.length} image(s) and ${otherFiles.length} other file(s)`);
    }
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput,
        images,
        attachments: otherFiles,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error occurred');
    }

    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;
    
    console.log(`AI Response generated in ${executionTime.toFixed(2)} seconds using ${data.model_used || 'unknown model'}`);
    
    return data.response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}
