# JalDrishti - Water Quality Analyser Module

JalDrishti provides offline analysis of chemical water testing strips, extracting pad colors from smartphone photos and matching them to safety parameter values.

---

## Technical Specifications

### Color Pad Extraction
* **Alignment Guideline**: On-screen bounding rectangle guide overlay is mapped using coordinate percentages:
  - Width: `12%` of image width.
  - Height: `70%` of image height.
* **Canvas Cropping**: The captured image is drawn to a canvas context and cropped down to the guideline region.
* **Averaging Engine**: Calculates the average RGB values inside three specific pad percentage offsets defined in [stripRegions.ts](file:///d:/GramSetu%20AI/app/jaldrishti/utils/stripRegions.ts).

### Color Matching Algorithm
* **Euclidean Color Distance**: Color matching computes the distance between the measured average pad RGB values and reference parameter database values:
  $$Distance = \sqrt{(R_{pad} - R_{ref})^2 + (G_{pad} - G_{ref})^2 + (B_{pad} - B_{ref})^2}$$
* **Parameters Evaluated**: Matches color swatches for pH, Nitrate, and Nitrite.
* **Safety Evaluation**: Classifies parameters as `safe`, `warning`, or `unsafe` based on color distance thresholds.

---

## File Structure & Component Reference

```
app/jaldrishti/
├── page.tsx                          # JalDrishti controller
├── types/
│   └── jaldrishti.types.ts           # Types: TestPad, ParameterResult, Recommendation
├── services/
│   ├── imageProcessor.ts             # Canvas cropper and pad RGB extractor
│   ├── waterAnalysisService.ts       # analyzeWaterQuality() mapper
│   └── recommendationEngine.ts       # Mappings for treatment guidelines
├── hooks/
│   ├── useCamera.ts                  # Camera capture stream hook
│   └── useStripAnalysis.ts           # Analysis pipeline state hook
├── utils/
│   ├── colorConversion.ts            # colorDistance() calculation
│   ├── referenceColors.ts            # Color swatches reference database
│   ├── statusMap.ts                  # Color and text safety mapping labels
│   └── stripRegions.ts               # Coordinates definition for pad locations
└── components/
    ├── CameraView.tsx                # Video stream alignment guide view
    ├── ImagePreview.tsx              # Snapshot check preview view
    ├── StripOverlay.tsx              # Target alignment bounding boxes
    ├── SafetySummaryBanner.tsx       # Overall safety evaluation bar
    ├── WaterReportCard.tsx           # Individual parameter result card
    └── RecommendationCard.tsx        # Boiling and treatment recommendation guidelines
```

### Component Details
* **CameraView**: Initial state view. Obtains video access via the camera hook and layers the alignment overlay.
* **StripOverlay**: Renders the green guideline box and the three parameter pad alignment targets.
* **SafetySummaryBanner**: Displays a header block colored according to the highest severity level found during matching (green for safe, yellow for warning, red for unsafe).
* **RecommendationCard**: Displays instructions (e.g. recommend boiling before use) based on safety status mappings.

---

## Development Guidelines

1. **Keep Changes Local**: All changes must remain inside the `app/jaldrishti/` directory.
2. **Context and Shared Components**: Do not import components or utilities directly from other modules (e.g. `app/swachh-audit/` or `app/swachhsankalp/`). Use global styles and root components from the root directory.
3. **Reference Swatches**: Changes to the reference strip color swatches database should be updated in `utils/referenceColors.ts`.
