# SwachhAudit — On-Device AI Sanitation Auditor

SwachhAudit is a mobile-first, edge-computing sanitation audit and waste segregation assistant designed specifically for Gram Panchayats and rural villagers. It runs fully local YOLOv8 computer vision object detection directly inside the browser using ONNX Runtime Web.

---

## 🚀 Key Features

*   **🧠 Local Edge AI (YOLOv8)**: Run high-accuracy garbage detection and classification offline in the browser. Zero cloud costs, absolute data privacy, and robust performance in low-connectivity rural zones.
*   **🎨 Smart Pixel-Color Analyzer (Fallback)**: When ONNX weights are not cached, a client-side canvas color-histogram sampler checks image tones (e.g. greens/yellows for wet waste, dark mud for sewage) to provide accurate mock segregation boxes.
*   **🟢/🟡/🔴 Dynamic Traffic Light Banner**: A highly highlighted status header showcasing real-time village cleanliness grades, dynamically compiling descriptions based on *only* the detected waste classes (e.g., won't show battery warnings if only food waste is scanned).
*   **🗣️ Voice Assist Playback ( English & ಕನ್ನಡ )**: Utilizes browser speech synthesis to read cleanliness ratings and segregation advice aloud, offering accessibility for low-literacy users. Includes a bouncing visual equalizer animation during speech.
*   **🔀 Bilingual Language Toggle**: Switch the entire interface between English and Kannada with a single tap.
*   **🗑️ Visual Segregation Dustbins**: Displays large, color-coded GREEN (Wet), BLUE (Dry), and RED (Hazardous) dustbin cards with specific local segregation instructions.
*   **🌱 Interactive Bio-Compost Calculator**: A standalone slider widget allowing farmers to estimate organic fertilizer yield from wet waste and read composting steps in English/Kannada.
*   **💬 One-Click GP PDO WhatsApp Report**: Prefills a WhatsApp template to instantly report drainage blockages and stagnant water to the local Panchayat Development Officer.
*   **📞 Swachh Bharat Grievance Dialer**: Dial the national sanitation hotline (`1916`) directly from the result screen.
*   **📄 Print-Optimized PDF Export**: Prints a clean, simplified summary report formatted for physical record-keeping.

---

## 📁 Directory Structure

```text
app/swachh-audit/
├── camera/            # Live camera capture page
├── components/        # Custom react components
│   ├── CleanlinessScoreCard.tsx
│   ├── DetectionPreview.tsx
│   ├── WasteSummaryCard.tsx
│   ├── SwachhAuditHeader.tsx
│   └── ...
├── detection/         # Local scanner & ORT loading screen
├── history/           # Saved report history logs (ID/Notes search)
├── hooks/             # Custom detection pipeline hooks
├── result/            # Redesigned villager results dashboard
├── services/          # AI pipeline services
│   ├── detection/
│   │   ├── detector.ts          # Core orchestrator
│   │   ├── modelLoader.ts       # ORT WebGL compiler
│   │   ├── imagePreprocessor.ts # 640x640 tensor scaler
│   │   └── postProcessor.ts     # NMS box filters
│   └── auditService.ts          # LocalStorage syncing service
├── upload/            # File upload page
├── utils/             # Heuristics & calculations
│   └── cleanliness.ts           # Severity, metrics, & recommendations
└── README.md          # This file
```

---

## 🛠️ Setup & Model Customization

### 1. Place Model Weights
Rename your compiled ONNX model weights to `yolov8n.onnx` and place it in the public assets directory:
📁 `public/models/yolov8n.onnx`

### 2. PyTorch to ONNX Export Instructions
To fine-tune a model on your custom village garbage dataset (e.g. TACO/TrashNet) and export it:
1. Install the Ultralytics toolkit:
   ```bash
   pip install ultralytics
   ```
2. Export your fine-tuned `best.pt` model weights to ONNX format:
   ```bash
   yolo export model=best.pt format=onnx imgsz=640
   ```
3. Copy the exported `best.onnx` to `public/models/yolov8n.onnx`.

### 3. Update Class Mappings
If your custom model has a different number of classes or ordering:
1. Open [detector.ts](file:///d:/GramSetu%20AI/app/swachh-audit/services/detection/detector.ts) and update the `CLASS_LABELS` array in the exact order of the training classes configuration.
2. Open [cleanliness.ts](file:///d:/GramSetu%20AI/app/swachh-audit/utils/cleanliness.ts) and modify `getCategoryFromLabel` and `generateRecommendations` keyword rules to map your labels to their respective categories (`dry`, `wet`, `hazardous`, `sanitation`).
