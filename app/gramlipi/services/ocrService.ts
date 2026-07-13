import { createWorker, PSM } from 'tesseract.js';
import type { OCRResult } from '../types';

/**
 * Runs OCR entirely in-browser using Tesseract.js. No image data ever
 * leaves the device — this keeps the module aligned with GramSetu AI's
 * on-device / privacy-first architecture.
 *
 * Accepts a preprocessed canvas (preferred — see preprocessImage below) or
 * a raw File/data URL as a fallback.
 */
export async function runOCR(
  imageSource: File | string | HTMLCanvasElement,
  onProgress?: (progress: number) => void
): Promise<Pick<OCRResult, 'rawText' | 'confidence'>> {
  const worker = await createWorker('eng', undefined, {
    logger: (message) => {
      if (message.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(message.progress * 100));
      }
    },
  });

  // Government notices are typically one uniform block of justified text
  // (especially once a header/logo has been cropped out). Telling
  // Tesseract that explicitly skips its default automatic layout analysis,
  // which otherwise second-guesses line/paragraph boundaries on documents
  // that don't actually need it.
  await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_BLOCK });

  try {
    const {
      data: { text, confidence },
    } = await worker.recognize(imageSource);

    return {
      rawText: text.trim(),
      confidence: Math.round(confidence),
    };
  } finally {
    // Always release the worker, even if recognition throws.
    await worker.terminate();
  }
}

interface PreprocessOptions {
  /**
   * Percentage (0–100) of the image height to exclude from the top before
   * OCR runs. Use this to crop out letterheads, seals, or logos — Tesseract
   * has no way to know a seal isn't text, and will confidently "read" its
   * shapes as characters. The only reliable fix is to never show it the
   * seal in the first place, rather than trying to filter the garbage out
   * afterwards (confidence scores don't distinguish a correctly-read word
   * from a confidently-misread logo).
   */
  cropTopPercent?: number;
  /**
   * Same idea, applied to the bottom of the image — useful for signature
   * blocks, official seals/stamps, or footer watermarks that Tesseract
   * would otherwise also try to read as text.
   */
  cropBottomPercent?: number;
}

/**
 * Improves OCR accuracy on real-world phone photos (uneven lighting, low
 * contrast, small text) by upscaling small images and applying adaptive
 * contrast stretching before Tesseract sees it. Optionally crops out
 * header/footer regions first (see cropTopPercent / cropBottomPercent).
 */
export async function preprocessImage(
  source: File | string,
  options: PreprocessOptions = {}
): Promise<HTMLCanvasElement> {
  const { cropTopPercent = 0, cropBottomPercent = 0 } = options;
  const imageUrl = typeof source === 'string' ? source : await fileToDataUrl(source);
  const img = await loadImage(imageUrl);

  // Clamp so the two crops can never eat the entire image — always leave
  // at least 20% of the original height as visible content.
  const safeTopPercent = Math.max(0, Math.min(cropTopPercent, 80));
  const safeBottomPercent = Math.max(0, Math.min(cropBottomPercent, 80 - safeTopPercent));

  const cropTopPx = Math.round((safeTopPercent / 100) * img.height);
  const cropBottomPx = Math.round((safeBottomPercent / 100) * img.height);
  const sourceHeight = img.height - cropTopPx - cropBottomPx;

  // Upscale small/low-res captures — Tesseract performs much better on
  // images with tall enough character heights.
  const MIN_WIDTH = 1500;
  const scale = img.width < MIN_WIDTH ? MIN_WIDTH / img.width : 1;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(sourceHeight * scale);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not process this image on your device.');
  }

  // Draw only the region below the crop line (drawImage's source rectangle
  // lets us skip the top cropTopPx rows entirely).
  ctx.drawImage(
    img,
    0,
    cropTopPx,
    img.width,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  const pixelCount = canvas.width * canvas.height;

  // Convert to grayscale and build a brightness histogram in one pass.
  const grayValues = new Uint8ClampedArray(pixelCount);
  const histogram = new Array(256).fill(0);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    grayValues[p] = gray;
    histogram[Math.round(gray)]++;
  }

  // Find the 1st/99th percentile brightness values and stretch that range
  // to fill 0–255. On an already-clean scan this range is already close to
  // 0–255, so the stretch is close to a no-op. On a dim/low-contrast phone
  // photo, the range is compressed, and stretching it sharpens text
  // against the background without the harsh clipping a fixed offset
  // would cause.
  const lowCutoff = pixelCount * 0.01;
  const highCutoff = pixelCount * 0.01;

  let cumulative = 0;
  let lowPoint = 0;
  for (let v = 0; v < 256; v++) {
    cumulative += histogram[v];
    if (cumulative >= lowCutoff) {
      lowPoint = v;
      break;
    }
  }

  cumulative = 0;
  let highPoint = 255;
  for (let v = 255; v >= 0; v--) {
    cumulative += histogram[v];
    if (cumulative >= highCutoff) {
      highPoint = v;
      break;
    }
  }

  const range = Math.max(highPoint - lowPoint, 1);

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const stretched = Math.min(255, Math.max(0, ((grayValues[p] - lowPoint) / range) * 255));
    data[i] = data[i + 1] = data[i + 2] = stretched;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load the captured image.'));
    img.src = src;
  });
}

/**
 * Converts a File (from upload or camera capture) into a data URL so it
 * can be previewed in the UI and stored in local component state.
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export function validateDocumentFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return 'Please upload a PNG, JPG, or WEBP image of the document.';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File is too large. Please upload an image under 10MB.';
  }
  return null;
}