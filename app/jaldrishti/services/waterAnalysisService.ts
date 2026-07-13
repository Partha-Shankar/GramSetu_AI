import { TestPad, ParameterResult } from '../types/jaldrishti.types';
import { REFERENCE_COLORS, PARAMETER_LABELS } from '../utils/referenceColors';
import { colorDistance } from '../utils/colorConversion';

/** Finds the closest reference swatch for one pad's measured color. */
function matchParameter(pad: TestPad): ParameterResult {
  const swatches = REFERENCE_COLORS[pad.parameter];

  let closest = swatches[0];
  let closestDistance = colorDistance(pad.avgColor, swatches[0].rgb);

  for (const swatch of swatches.slice(1)) {
    const distance = colorDistance(pad.avgColor, swatch.rgb);
    if (distance < closestDistance) {
      closest = swatch;
      closestDistance = distance;
    }
  }

  return {
    parameter: pad.parameter,
    label: PARAMETER_LABELS[pad.parameter],
    level: closest.level,
    status: closest.status,
  };
}

export function analyzeWaterQuality(pads: TestPad[]): ParameterResult[] {
  return pads.map(matchParameter);
}