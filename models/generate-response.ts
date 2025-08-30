export async function generateLegalResponse(userInput: string, attachments?: File[]): Promise<string> {
  const startTime = Date.now();

  try {
    const attachmentInfo = attachments ? attachments.map(f => ({ name: f.name, size: f.size, type: f.type })) : [];
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInput,
        attachments: attachmentInfo,
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
    
    console.log(`AI Response generated in ${executionTime.toFixed(2)} seconds`);
    
    return data.response;
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}
