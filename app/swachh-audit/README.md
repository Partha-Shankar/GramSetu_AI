# SwachhAudit Module

The **SwachhAudit** module provides offline-first sanitation monitoring, waste classification, cleanliness scoring, and severity analysis using on-device browser-based AI computer vision.

---

## Folder Structure

All module-specific code is isolated inside `app/swachh-audit/` to satisfy the strict architectural boundary requirements:

*   **`camera/`** – Contains the live webcam/mobile camera scan page.
*   **`upload/`** – Contains the photo drag-and-drop/paste file upload page.
*   **`detection/`** – Contains the real-time AI processing screen with console logs and progress indicators.
*   **`result/`** – Contains the audit diagnostic report page with bounding box overlays and JSON exports.
*   **`history/`** – Contains the list of completed audits stored in local history.
*   **`components/`** – Module-specific React UI components (e.g. `CameraCard`, `UploadCard`, `DetectionPreview`).
*   **`context/`** – Contains `AuditContext.tsx` which manages the shared transient state (captured image, model progress, logs, errors).
*   **`hooks/`** – Reusable custom React hooks:
    *   `useCamera.ts` – Stream initialization, permission handling, canvas frame captures, and front/back toggles.
    *   `useImageUpload.ts` – File drag-and-drop, copy-paste handlers, format validations, and canvas-based compression.
    *   `useDetection.ts` – High-level execution coordinator.
*   **`services/`** – Storage and AI pipeline services:
    *   `auditService.ts` – Persistent LocalStorage history management.
    *   `detection/` – ONNX inference pipeline (preprocessor, session loader, NMS postprocessor, and detector service).
*   **`utils/`** – Utility functions:
    *   `cleanliness.ts` – Cleanliness score calculations, category mappings, severity analysis, and recommendation engines.

---

## Detection Pipeline

The pipeline processes input images through five distinct steps:

```
[Input Image (Base64/File)]
          ↓
[Canvas Resizing to 640x640 & Normalization]  (imagePreprocessor.ts)
          ↓
[ONNX Runtime Web Inference Session]         (modelLoader.ts)
          ↓
[Non-Maximum Suppression (NMS) & Decoding]    (postProcessor.ts)
          ↓
[Cleanliness & Severity Diagnostics Payload]   (cleanliness.ts)
```

1.  **Preprocessing**: The image is drawn onto an offscreen canvas, resized to `640x640` pixels, and converted into a planar Float32Array RGB tensor scaled to `[0.0, 1.0]`.
2.  **Model Inference**: The tensor is processed by `onnxruntime-web` using WebGL (with WebAssembly CPU fallback).
3.  **Post-processing**: Bounding box outputs are filtered by a confidence threshold ($\ge 0.25$), overlapped boxes are suppressed using NMS (IoU threshold $\ge 0.45$), and coordinates are scaled back to percentage ratios ($0-100\%$) for flexible rendering.
4.  **Scoring & Severity**: Utilities analyze the results to determine:
    *   *Cleanliness Score*: Calculated out of 100 based on counts, coverage, and hazard weights.
    *   *Severity*: Ranked as Low, Medium, High, or Critical.
    *   *Recommendations*: Deterministic, rule-based instructions corresponding to the detected waste categories.

---

## LocalStorage Schema

History reports are saved locally under the key `gramsetu_swachh_audit_history` in the following format:

```typescript
export interface DetectionResult {
  id: string;
  label: string;
  confidence: number;
  category: 'dry' | 'wet' | 'hazardous' | 'sanitation';
  bbox: {
    x: number;      // % from left (0-100)
    y: number;      // % from top (0-100)
    width: number;  // % width (0-100)
    height: number; // % height (0-100)
  };
}

export interface SwachhAuditReport {
  id: string;
  timestamp: string;
  imageSrc: string; // base64 representation
  detections: DetectionResult[];
  cleanlinessScore: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  villageName: string;
  objectCount: number;
  notes?: string;
  recommendations: string[];
}
```

---

## How to Replace the Mock Detector with a Real Model

The module is designed with an adapter architecture. Swapping the mock inference system for a real YOLO ONNX model requires changing only two areas:

1.  **Place the weights file**:
    Save your compiled YOLOv8 model in the public folder:
    `/public/models/yolov8n.onnx`
2.  **Enable the forward-pass**:
    The [detector.ts](file:///d:/GramSetu%20AI/app/swachh-audit/services/detection/detector.ts) service is configured to automatically attempt model loading. If it finds the file, it runs the WebGL forward-pass instead of mock detections. To make it strictly enforce the model (without mock fallbacks), modify `runDetection` in `detector.ts`:
    ```typescript
    // Change this block in detector.ts to remove the fallback if you want to enforce strict AI failure
    try {
      session = await modelLoader.loadModel();
    } catch (err) {
      // Throw error directly instead of setting useMock = true
      throw new Error("Local AI model failed to load: " + err.message);
    }
    ```
