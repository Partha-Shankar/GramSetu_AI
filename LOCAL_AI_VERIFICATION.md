# GramSetu AI - Local AI Verification Manual

This document provides verification details for the local, on-device AI implementations in GramSetu AI. It specifies which models run in-browser, when network connectivity is used, and how data privacy is maintained.

---

## 1. AI Execution Architecture

GramSetu AI executes machine learning models entirely inside the client's web browser using standard web technologies.

```
+---------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                  |
|                                                                                 |
|  +-------------------+      +-------------------+      +---------------------+  |
|  |   SwachhAudit     |      |     GramLipi      |      |     JalDrishti      |  |
|  |   YOLOv8 ONNX     |      |  Tesseract OCR    |      |  Euclidean Matcher  |  |
|  +-------------------+      +-------------------+      +---------------------+  |
|           |                           |                           |             |
|           v                           v                           v             |
|    onnxruntime-web            Tesseract Worker            HTML5 Canvas Context  |
|   (WebGL / WASM CPU)         (Grayscale Stretch)          (Average RGB extraction)|
+---------------------------------------------------------------------------------+
```

---

## 2. On-Device AI Verification Matrix

This matrix details the runtime, execution environment, and network requirements for each feature:

| Feature | Runs Locally? | Internet Required? | Model / Algorithm | Runtime Engine | User Data Leaves Device? |
| :--- | :---: | :---: | :--- | :--- | :---: |
| **Litter Detection (SwachhAudit)** | Yes | No | YOLOv8-nano (`yolov8n.onnx`) | `onnxruntime-web` (WebGL / WASM) | **No** |
| **Cleanliness Scoring** | Yes | No | Custom bounding box area ratio algorithm | Native JavaScript | **No** |
| **Notice Text Extraction (GramLipi)** | Yes | No | Tesseract OCR (`eng.traineddata`) | `Tesseract.js` Web Worker | **No** |
| **Image Preprocessing** | Yes | No | Contrast stretching and grayscale conversion | HTML5 Canvas Context API | **No** |
| **Text Translation (GramLipi)** | Yes | No | Llama-3.2-3B | Local Ollama Server API (`localhost`) | **No** (Stays on local host network) |
| **Pad Extraction (JalDrishti)** | Yes | No | Coordinate-based guide region crop | HTML5 Canvas Context API | **No** |
| **Strip Color Matching** | Yes | No | Euclidean color distance matching | Native JavaScript | **No** |
| **Cleanliness Charts (SwachhSankalp)** | Yes | No | Custom SVG graphs | React / Virtual DOM | **No** |

---

## 3. Data Processing Boundaries

### Data That Remains 100% In-Browser
* **Video Frames & Camera Snapshots**: Captures from the device camera are processed in memory and drawn to HTML5 canvas components. No raw images are sent over the network.
* **Extracted OCR Text**: Extracted text from scanned circulars is processed locally in memory.
* **Cleanliness Reports**: The PDF report generator compiles images and metadata into a PDF blob locally in the browser.
* **Audit History & Checklist State**: Stored in the browser's `localStorage` sandbox, isolated to the application origin.

### Network Usage Specifications
1. **Initial Asset Download**: Internet access is required only to download the application's static HTML/JS bundles and model weights upon the first visit. Subsequent loads use the browser cache.
2. **GramLipi Translation**: To translate notices, the application makes an HTTP POST request to `http://localhost:11434/api/generate`. This is a loopback network call to an Ollama server running locally on the user's computer. No data leaves the local machine.
3. **No External Cloud Calls**: The application does not communicate with external cloud services, analytics platforms, or third-party servers during operation.
