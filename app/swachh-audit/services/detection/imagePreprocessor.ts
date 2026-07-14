/**
 * Preprocesses an image from a URL or base64 string to prepare it for YOLO inference.
 * Resizes the image to 640x640, extracts RGB planar channels, and normalizes values to [0, 1].
 */
export async function preprocessImage(imageSrc: string): Promise<{
  tensor: Float32Array;
  originalWidth: number;
  originalHeight: number;
}> {
  if (typeof window === 'undefined') {
    throw new Error('Image preprocessing is only supported in browser environments.');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const originalWidth = img.width;
      const originalHeight = img.height;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 640;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not create 2D canvas context.');
        }

        // Draw image onto 640x640 canvas
        ctx.drawImage(img, 0, 0, 640, 640);

        // Extract RGBA pixels
        const imgData = ctx.getImageData(0, 0, 640, 640);
        const data = imgData.data;

        // Allocate Float32 arrays for Planar (NCHW) format: RRR... GGG... BBB...
        const rChannel = new Float32Array(640 * 640);
        const gChannel = new Float32Array(640 * 640);
        const bChannel = new Float32Array(640 * 640);

        for (let i = 0; i < 640 * 640; i++) {
          const idx = i * 4;
          rChannel[i] = data[idx] / 255.0;     // Red
          gChannel[i] = data[idx + 1] / 255.0; // Green
          bChannel[i] = data[idx + 2] / 255.0; // Blue
        }

        // Combine channels into a single contiguous float32 array
        const tensorData = new Float32Array(3 * 640 * 640);
        tensorData.set(rChannel, 0);
        tensorData.set(gChannel, 640 * 640);
        tensorData.set(bChannel, 2 * 640 * 640);

        resolve({
          tensor: tensorData,
          originalWidth,
          originalHeight,
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for AI preprocessing.'));
    };

    img.src = imageSrc;
  });
}
