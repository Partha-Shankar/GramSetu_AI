import { DetectionResult } from '../types/types';

/**
 * Maps a detection label to its corresponding waste category.
 */
export function getCategoryFromLabel(label: string): 'dry' | 'wet' | 'hazardous' | 'sanitation' {
  const norm = label.toLowerCase().trim();

  // Explicit mappings based on requirements
  if (norm === 'plastic' || norm.includes('plastic') || norm.includes('wrapper') || norm.includes('bottle')) {
    return 'dry';
  }
  if (norm === 'paper' || norm.includes('paper')) {
    return 'dry';
  }
  if (norm === 'cardboard' || norm.includes('cardboard') || norm.includes('box')) {
    return 'dry';
  }
  if (norm === 'metal' || norm.includes('metal') || norm.includes('can')) {
    return 'dry';
  }
  if (norm === 'glass' || norm.includes('glass') || norm.includes('shard')) {
    return 'dry';
  }
  if (norm === 'organic waste' || norm.includes('organic')) {
    return 'wet';
  }
  if (norm === 'food waste' || norm.includes('food')) {
    return 'wet';
  }
  if (norm === 'electronic waste' || norm.includes('electronic') || norm.includes('e-waste')) {
    return 'hazardous';
  }
  if (norm === 'sewage' || norm.includes('sewage') || norm.includes('drain')) {
    return 'sanitation';
  }
  if (norm === 'stagnant water' || norm.includes('stagnant') || norm.includes('water')) {
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
export function calculateCleanlinessMetrics(detections: DetectionResult[]): CleanlinessMetrics {
  const objectCount = detections.length;

  // Calculate sum of areas of all bounding boxes (capped at 100%)
  // Since box dimensions are percentages (0-100), the area is (width * height) / 100.
  let totalArea = 0;
  detections.forEach((det) => {
    const area = (det.bbox.width * det.bbox.height) / 100;
    totalArea += area;
  });
  const areaCoverage = Math.min(Math.round(totalArea * 10) / 10, 100);

  // Calculate Hazard Score based on category weights:
  // - dry: 3 points
  // - wet: 5 points
  // - hazardous: 8 points
  // - sanitation: 10 points
  let hazardScore = 0;
  detections.forEach((det) => {
    switch (det.category) {
      case 'dry':
        hazardScore += 3;
        break;
      case 'wet':
        hazardScore += 5;
        break;
      case 'hazardous':
        hazardScore += 8;
        break;
      case 'sanitation':
        hazardScore += 10;
        break;
    }
  });

  // Waste Density can be defined as percentage area coverage (0-1)
  const wasteDensity = Math.min(Math.round((areaCoverage / 100) * 100) / 100, 1);

  // Overall Cleanliness Score:
  // Starts at 100, subtract penalties for objects, area coverage, and hazard levels.
  // Base Penalty Formula:
  // Penalty = (Object Count * 4) + (Area Coverage * 0.8) + (Hazard Score * 1.2)
  const penalty = (objectCount * 4) + (areaCoverage * 0.8) + (hazardScore * 1.2);
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
    wasteDensity,
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

  // 1. Critical cases:
  // - Sanitation Issue is present (Sewage, Stagnant Water pose severe health hazard)
  // - High object count (> 8 items)
  // - Extensive coverage (> 50% of the image contains trash)
  if (hasSanitation || objectCount > 8 || areaCoverage > 50) {
    return 'critical';
  }

  // 2. High cases:
  // - Hazardous Waste (Electronic Waste) is present
  // - Medium-high object count (> 4 items)
  // - Substantial coverage (> 25% of the image)
  if (hasHazardous || objectCount > 4 || areaCoverage > 25) {
    return 'high';
  }

  // 3. Medium cases:
  // - Scattered litter (>= 2 items)
  // - Moderate coverage (> 10% of the image)
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

  // 1. Dry waste rule (plastic, paper, cardboard, metal, glass)
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
      l.includes('shard')
  );
  if (hasDry) {
    recommendations.push('Dry waste detected. Please discard it in the BLUE dustbin for recycling.');
  }

  // 2. Wet waste rule (organic, food)
  const hasWet = Array.from(labels).some((l) => l.includes('organic') || l.includes('food') || l.includes('decay'));
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
