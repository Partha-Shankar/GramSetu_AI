import { CLASS_LABELS } from './detector';
import { DetectionResult } from '../../types/types';
import { getCategoryFromLabel } from '../../utils/cleanliness';

interface RawBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  score: number;
  classId: number;
}

/**
 * Calculates the Intersection over Union (IoU) of two bounding boxes.
 */
function calculateIoU(boxA: RawBox, boxB: RawBox): number {
  const xA = Math.max(boxA.x1, boxB.x1);
  const yA = Math.max(boxA.y1, boxB.y1);
  const xB = Math.min(boxA.x2, boxB.x2);
  const yB = Math.min(boxA.y2, boxB.y2);

  const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
  const boxAArea = (boxA.x2 - boxA.x1) * (boxA.y2 - boxA.y1);
  const boxBArea = (boxB.x2 - boxB.x1) * (boxB.y2 - boxB.y1);

  return interArea / (boxAArea + boxBArea - interArea || 1);
}

/**
 * Performs Non-Maximum Suppression (NMS) to remove overlapping redundant boxes.
 */
function nonMaxSuppression(boxes: RawBox[], iouThreshold: number): RawBox[] {
  // Sort boxes by confidence score descending
  boxes.sort((a, b) => b.score - a.score);

  const keep: RawBox[] = [];
  const active = new Array(boxes.length).fill(true);

  for (let i = 0; i < boxes.length; i++) {
    if (!active[i]) continue;
    const box = boxes[i];
    keep.push(box);

    for (let j = i + 1; j < boxes.length; j++) {
      if (!active[j]) continue;
      // Suppress highly overlapping boxes of the same class
      if (box.classId === boxes[j].classId) {
        const iou = calculateIoU(box, boxes[j]);
        if (iou > iouThreshold) {
          active[j] = false;
        }
      }
    }
  }

  return keep;
}

/**
 * Post-processes raw ONNX model outputs to get structured DetectionResult items.
 * Supports YOLOv8 output tensor of shape [1, 4 + numClasses, 8400].
 */
export function postProcess(
  outputTensor: Float32Array,
  dims: readonly number[],
  confidenceThreshold = 0.25,
  iouThreshold = 0.45
): DetectionResult[] {
  // Output shape typically [1, 4 + numClasses, 8400]
  // dims: [1, rows, cols]
  const rows = dims[1]; // 4 + numClasses
  const cols = dims[2]; // 8400 boxes
  const numClasses = rows - 4;

  const rawBoxes: RawBox[] = [];

  for (let col = 0; col < cols; col++) {
    // 1. Find the class with maximum score
    let maxScore = 0;
    let classId = -1;

    for (let c = 0; c < numClasses; c++) {
      const score = outputTensor[(4 + c) * cols + col];
      if (score > maxScore) {
        maxScore = score;
        classId = c;
      }
    }

    // 2. Filter by confidence threshold
    if (maxScore >= confidenceThreshold) {
      const xCenter = outputTensor[0 * cols + col];
      const yCenter = outputTensor[1 * cols + col];
      const width = outputTensor[2 * cols + col];
      const height = outputTensor[3 * cols + col];

      // Convert from center coordinate box to top-left / bottom-right coordinates on 640x640 grid
      const x1 = xCenter - width / 2;
      const y1 = yCenter - height / 2;
      const x2 = xCenter + width / 2;
      const y2 = yCenter + height / 2;

      rawBoxes.push({
        x1,
        y1,
        x2,
        y2,
        score: maxScore,
        classId,
      });
    }
  }

  // 3. Perform NMS
  const suppressedBoxes = nonMaxSuppression(rawBoxes, iouThreshold);

  // 4. Map to DetectionResult type with percentages
  return suppressedBoxes.map((box, idx) => {
    const label = CLASS_LABELS[box.classId] || `Unknown Class (${box.classId})`;
    
    // Clamp values between 0 and 640, then express as percentage 0-100
    const xPct = Math.max(0, Math.min(100, (box.x1 / 640) * 100));
    const yPct = Math.max(0, Math.min(100, (box.y1 / 640) * 100));
    const wPct = Math.max(0, Math.min(100, ((box.x2 - box.x1) / 640) * 100));
    const hPct = Math.max(0, Math.min(100, ((box.y2 - box.y1) / 640) * 100));

    return {
      id: `det-ai-${Date.now()}-${idx}`,
      label,
      confidence: Math.round(box.score * 100) / 100,
      category: getCategoryFromLabel(label),
      bbox: {
        x: Math.round(xPct * 10) / 10,
        y: Math.round(yPct * 10) / 10,
        width: Math.round(wPct * 10) / 10,
        height: Math.round(hPct * 10) / 10,
      },
    };
  });
}
