/**
 * Utility functions for image processing and base64 conversion
 */

export interface ImageData {
  base64: string;
  mimeType: string;
  fileName: string;
  size: number;
}

/**
 * Converting a File object to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Removing the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsDataURL(file);
  });
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

export async function processAttachments(files: File[]): Promise<{
  images: ImageData[];
  otherFiles: { name: string; size: number; type: string }[];
}> {
  const images: ImageData[] = [];
  const otherFiles: { name: string; size: number; type: string }[] = [];

  for (const file of files) {
    if (isImageFile(file)) {
      try {
        const base64 = await fileToBase64(file);
        images.push({
          base64,
          mimeType: file.type,
          fileName: file.name,
          size: file.size
        });
      } catch (error) {
        console.error(`Failed to process image ${file.name}:`, error);
        otherFiles.push({
          name: file.name,
          size: file.size,
          type: file.type
        });
      }
    } else {
      otherFiles.push({
        name: file.name,
        size: file.size,
        type: file.type
      });
    }
  }

  return { images, otherFiles };
}

export function isValidImageFormat(mimeType: string): boolean {
  const supportedFormats = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp'
  ];
  return supportedFormats.includes(mimeType.toLowerCase());
}
