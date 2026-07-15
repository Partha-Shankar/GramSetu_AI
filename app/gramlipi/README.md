# GramLipi - Notice Extraction and Simplification Module

GramLipi provides offline document digitization, OCR text extraction, and automated translation/simplification for regional government circulars and notices.

---

## Technical Specifications

### OCR Processing
* **Engine**: Tesseract.js running inside an isolated browser Web Worker thread.
* **Asset Loading**: Model training data files (`eng.traineddata` / `kan.traineddata`) are fetched locally and cached in the browser.
* **Pre-processing**:
  - Gray-scaling: Computes luminance using weights $Y = 0.299R + 0.587G + 0.114B$.
  - Adaptive Contrast Stretching: Normalizes pixel brightness histogram values to sharp text outlines.
  - Image Upscaling: Scales up images with a width below `1500px`.

### LLM Translation and Simplification
* **Model**: Llama-3.2-3B.
* **Integration Interface**: Communicates with a local Ollama server running at `http://localhost:11434/api/generate`.
* **Prompt Isolation**: Custom prompt wrappers construct specific instructions to force JSON object outputs matching structural interface schemas.

---

## File Structure & Component Reference

```
app/gramlipi/
├── page.tsx                          # GramLipi Page Controller
├── types/
│   └── index.ts                      # Types: Language, DocumentSummary, OCRResult
├── services/
│   ├── ocrService.ts                 # runOCR(), preprocessImage()
│   └── llmService.ts                 # summarizeDocument(), simplifyDocument()
├── hooks/
│   └── useDocumentOcr.ts             # OCR and LLM execution state controller
└── components/
    ├── document-upload-card.tsx      # Upload input target area
    ├── camera-capture-modal.tsx      # Video canvas snapshot modal
    ├── ocr-preview-card.tsx          # Extracted editable text card
    └── document-preview-card.tsx     # Double panel preview card (Original vs Simplified)
```

### Component Details
* **DocumentUploadCard**: Accepts image file inputs, handles validation rules (accepts PNG/JPG/WEBP up to 10MB), and reads files locally.
* **CameraCaptureModal**: Launches the camera feed using media devices, letting the user take snapshots.
* **OcrPreviewCard**: Renders the extracted raw text, allowing the user to make manual corrections before initiating translation or simplification.
* **DocumentPreviewCard**: Renders side-by-side or stacked panels displaying the original text alongside the simplified/translated summary JSON fields (Main Purpose, Important Dates, Required Actions, Key Points).

---

## Development Guidelines

1. **Keep Changes Local**: All logic modifications must remain inside the `app/gramlipi/` sandbox boundary.
2. **Context and Shared Components**: Do not import components or utilities directly from other modules (e.g. `app/swachh-audit/` or `app/swachhsankalp/`). Use global styles and root components from the root directory.
3. **LLM Connection**: In local development, the Ollama server must be running with CORS permissions enabled for the web host origin (`OLLAMA_ORIGINS="http://localhost:3000"`).
