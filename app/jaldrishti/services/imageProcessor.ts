'use client';

import { GUIDE_RECT } from '../components/StripOverlay';
import { PAD_REGIONS, PadRegionConfig } from '../utils/stripRegions';
import { CapturedImage, TestPad } from '../types/jaldrishti.types';

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Crops the captured photo down to just the region inside the strip
 * alignment guide (GUIDE_RECT), since that's where the user was told
 * to place the strip. No AI/detection needed — the overlay already
 * tells us exactly where to look.
 */
export async function cropToGuideRegion(image: CapturedImage): Promise<HTMLCanvasElement> {
  const img = await loadImage(image.dataUrl);

  const cropX = (GUIDE_RECT.xPct / 100) * img.width;
  const cropY = (GUIDE_RECT.yPct / 100) * img.height;
  const cropW = (GUIDE_RECT.widthPct / 100) * img.width;
  const cropH = (GUIDE_RECT.heightPct / 100) * img.height;

  const canvas = document.createElement('canvas');
  canvas.width = cropW;
  canvas.height = cropH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context.');

  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
  return canvas;
}

/**
 * Averages the RGB values of every pixel inside a rectangular region.
 * This is the "color reading" for one test pad.
 */
function getAverageColor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): { r: number; g: number; b: number } {
  const { data } = ctx.getImageData(x, y, w, h);
  let r = 0, g = 0, b = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  return {
    r: Math.round(r / pixelCount),
    g: Math.round(g / pixelCount),
    b: Math.round(b / pixelCount),
  };
}

/**
 * Slices the cropped strip into individual test pad regions and
 * returns the average color for each one.
 */
export function extractPads(croppedCanvas: HTMLCanvasElement): TestPad[] {
  const ctx = croppedCanvas.getContext('2d');
  if (!ctx) throw new Error('Could not read canvas context.');

  return PAD_REGIONS.map((region: PadRegionConfig) => {
    const x = Math.round((region.xPct / 100) * croppedCanvas.width);
    const y = Math.round((region.yPct / 100) * croppedCanvas.height);
    const w = Math.round((region.widthPct / 100) * croppedCanvas.width);
    const h = Math.round((region.heightPct / 100) * croppedCanvas.height);

    const avgColor = getAverageColor(ctx, x, y, w, h);

    return {
      id: region.parameter,
      parameter: region.parameter,
      avgColor,
    };
  });
}

/**
 * Full Day 2 pipeline: captured photo -> cropped strip -> per-pad average colors.
 * Day 3 will take this TestPad[] output and match each color against reference
 * values to produce real pH/Nitrate/etc. readings.
 */
export async function processStripImage(image: CapturedImage): Promise<TestPad[]> {
  const croppedCanvas = await cropToGuideRegion(image);
  return extractPads(croppedCanvas);
}