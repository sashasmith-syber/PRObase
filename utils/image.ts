/**
 * @param dataUrl - Source image data URL.
 * @param options - Compression options.
 * @returns Compressed image data URL and MIME type, or null on failure.
 */
export const compressImageDataUrl = async (
  dataUrl: string,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  }
): Promise<{ dataUrl: string; mimeType: string } | null> => {
  const maxWidth = options?.maxWidth ?? 1280;
  const maxHeight = options?.maxHeight ?? 1280;
  const quality = options?.quality ?? 0.8;
  const mimeType = options?.mimeType ?? 'image/webp';

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const widthScale = maxWidth / image.width;
      const heightScale = maxHeight / image.height;
      const scale = Math.min(1, widthScale, heightScale);

      const targetWidth = Math.max(1, Math.floor(image.width * scale));
      const targetHeight = Math.max(1, Math.floor(image.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        resolve(null);
        return;
      }

      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      const compressedDataUrl = canvas.toDataURL(mimeType, quality);
      resolve({ dataUrl: compressedDataUrl, mimeType });
    };

    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });
};
