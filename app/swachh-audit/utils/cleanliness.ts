import { DetectionResult } from '../types/types';

/**
 * Maps a detection label to its corresponding waste category.
 */
export function getCategoryFromLabel(label: string): 'dry' | 'wet' | 'hazardous' | 'sanitation' {
  const norm = label.toLowerCase().trim();

  // Explicit mappings based on requirements
  if (norm.includes('plastic') || norm.includes('wrapper') || norm.includes('bottle') || norm.includes('glass')) {
    return 'dry';
  }
  if (norm.includes('paper') || norm.includes('cardboard') || norm.includes('box') || norm.includes('trash') || norm.includes('litter')) {
    return 'dry';
  }
  if (norm.includes('metal') || norm.includes('can') || norm.includes('clothes') || norm.includes('shoes')) {
    return 'dry';
  }
  if (norm.includes('organic') || norm.includes('food') || norm.includes('biological') || norm.includes('decay')) {
    return 'wet';
  }
  if (norm.includes('electronic') || norm.includes('battery') || norm.includes('e-waste')) {
    return 'hazardous';
  }
  if (norm.includes('sewage') || norm.includes('drain') || norm.includes('stagnant') || norm.includes('water')) {
    return 'sanitation';
  }

  // Fallbacks:
  const dryKeywords = ['plastic', 'paper', 'cardboard', 'metal', 'glass', 'wrapper', 'bottle', 'box', 'can', 'shard', 'trash', 'litter'];
  const wetKeywords = ['organic', 'food', 'decay', 'wet'];
  const hazardousKeywords = ['electronic', 'battery', 'e-waste', 'chemical', 'hazard'];
  const sanitationKeywords = ['sewage', 'stagnant', 'water', 'drain', 'puddle', 'sludge'];

  if (dryKeywords.some((kw) => norm.includes(kw))) return 'dry';
  if (wetKeywords.some((kw) => norm.includes(kw))) return 'wet';
  if (hazardousKeywords.some((kw) => norm.includes(kw))) return 'hazardous';
  if (sanitationKeywords.some((kw) => norm.includes(kw))) return 'sanitation';

  return 'dry'; // Default fallback
}

export interface CleanlinessMetrics {
  objectCount: number;
  wasteDensity: number;
  hazardScore: number;
  areaCoverage: number;
  cleanlinessScore: number;
  rating: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';
}

/**
 * Calculates cleanliness metrics for a list of detections.
 */
/**
 * Calculates cleanliness metrics for a list of detections.
 */
export function calculateCleanlinessMetrics(detections: DetectionResult[]): CleanlinessMetrics {
  const objectCount = detections.length;

  // Calculate sum of areas of all bounding boxes (capped at 100%)
  let totalArea = 0;
  detections.forEach((det) => {
    const area = (det.bbox.width * det.bbox.height) / 100;
    totalArea += area;
  });
  const areaCoverage = Math.min(Math.round(totalArea * 10) / 10, 100);

  // Define individual item penalties:
  // - dry: 1.5 points
  // - wet: 0.6 points (biodegradable organic waste has very low hazard)
  // - hazardous: 6.0 points
  // - sanitation: 10.0 points
  let itemPenaltySum = 0;
  let hazardScore = 0;

  detections.forEach((det) => {
    switch (det.category) {
      case 'dry':
        itemPenaltySum += 1.5;
        hazardScore += 3;
        break;
      case 'wet':
        itemPenaltySum += 0.6;
        hazardScore += 1;
        break;
      case 'hazardous':
        itemPenaltySum += 6.0;
        hazardScore += 8;
        break;
      case 'sanitation':
        itemPenaltySum += 10.0;
        hazardScore += 10;
        break;
    }
  });

  // Total penalty sum is a combination of item densities and area coverage
  const penalty = itemPenaltySum + (areaCoverage * 0.8);
  const cleanlinessScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  // Determine Rating category based on score
  let rating: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';
  if (cleanlinessScore >= 90) {
    rating = 'Excellent';
  } else if (cleanlinessScore >= 75) {
    rating = 'Good';
  } else if (cleanlinessScore >= 50) {
    rating = 'Moderate';
  } else if (cleanlinessScore >= 30) {
    rating = 'Poor';
  } else {
    rating = 'Critical';
  }

  return {
    objectCount,
    wasteDensity: Math.min(Math.round((areaCoverage / 100) * 100) / 100, 1),
    hazardScore,
    areaCoverage,
    cleanlinessScore,
    rating,
  };
}

/**
 * Calculates severity based on object count, waste types, and coverage.
 */
export function calculateSeverity(
  detections: DetectionResult[],
  areaCoverage: number
): 'low' | 'medium' | 'high' | 'critical' {
  const objectCount = detections.length;

  const hasSanitation = detections.some((d) => d.category === 'sanitation');
  const hasHazardous = detections.some((d) => d.category === 'hazardous');
  const hasDry = detections.some((d) => d.category === 'dry');
  const hasWet = detections.some((d) => d.category === 'wet');

  // 1. Critical cases:
  // - Sanitation Issue is present (Sewage, Stagnant Water pose severe health vector breeding hazard)
  // - Or mixed toxic hazardous waste with high coverage
  if (hasSanitation || (hasHazardous && (objectCount > 8 || areaCoverage > 40))) {
    return 'critical';
  }

  // 2. High cases:
  // - Hazardous Waste (Electronic Waste) is present
  // - Large solid dry waste dumps (> 12 items or > 40% coverage)
  if (hasHazardous || (hasDry && (objectCount > 12 || areaCoverage > 40)) || (hasWet && objectCount > 25)) {
    return 'high';
  }

  // 3. Medium cases:
  // - Scattered litter (wet/dry waste > 2 items or > 10% coverage)
  if (objectCount >= 2 || areaCoverage > 10) {
    return 'medium';
  }

  // 4. Low case:
  // - Clean or trace litter (0 or 1 minor item)
  return 'low';
}

/**
 * Generates rule-based, deterministic recommendations based on detected waste types.
 */
export function generateRecommendations(detections: DetectionResult[]): string[] {
  if (detections.length === 0) {
    return ['The site is clean. Maintain standard regular sweeping and monitoring. No immediate action required.'];
  }

  const recommendations: string[] = [];
  const labels = new Set(detections.map((d) => d.label.toLowerCase().trim()));

  // 1. Dry waste rule (plastic, paper, cardboard, metal, glass, clothes, shoes, trash)
  const hasDry = Array.from(labels).some(
    (l) =>
      l.includes('plastic') ||
      l.includes('wrapper') ||
      l.includes('bottle') ||
      l.includes('paper') ||
      l.includes('cardboard') ||
      l.includes('box') ||
      l.includes('metal') ||
      l.includes('can') ||
      l.includes('glass') ||
      l.includes('shard') ||
      l.includes('clothes') ||
      l.includes('shoes') ||
      l.includes('trash')
  );
  if (hasDry) {
    recommendations.push('Dry waste detected. Please discard it in the BLUE dustbin for recycling.');
  }

  // 2. Wet waste rule (organic, food, biological, decay)
  const hasWet = Array.from(labels).some(
    (l) => l.includes('organic') || l.includes('food') || l.includes('biological') || l.includes('decay')
  );
  if (hasWet) {
    recommendations.push('Wet waste detected. Please discard it in the GREEN dustbin for composting.');
  }

  // 3. Electronic / Hazardous waste rule (battery, electronic)
  const hasHazardous = Array.from(labels).some(
    (l) => l.includes('electronic') || l.includes('e-waste') || l.includes('battery')
  );
  if (hasHazardous) {
    recommendations.push('Hazardous/Electronic waste detected. Please discard it in the RED dustbin for safe specialized disposal.');
  }

  // 4. Sewage / Stagnant Water / Drainage blockage rule
  const hasSanitation = Array.from(labels).some(
    (l) => l.includes('sewage') || l.includes('drain') || l.includes('stagnant') || l.includes('water')
  );
  if (hasSanitation) {
    recommendations.push('Stagnant water or drainage blockage detected. Clear blockages immediately, or report it to the Panchayat Development Officer (PDO) of your Gram Panchayat.');
  }

  // Fallback if there are objects but none triggered specific keywords
  if (recommendations.length === 0) {
    recommendations.push('Waste detected. Segregate and dispose of dry waste in the BLUE dustbin and wet waste in the GREEN dustbin.');
  }

  return recommendations;
}
