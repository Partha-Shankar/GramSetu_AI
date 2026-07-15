# GramSetu AI

GramSetu AI is an offline-first, client-side application designed to support rural communities with tools for sanitation audits, water quality analysis, document translation, and local developmental planning. It performs all core computations—including computer vision inference and OCR text extraction—directly inside the user's browser, eliminating the need for constant cloud connectivity or server-side data processing.

---

## The Problem and Purpose

### The Digital Divide in Rural Areas
Rural digitization initiatives frequently fail due to intermittent or non-existent internet connectivity. Applications that rely on cloud-based APIs for image processing, machine learning inference, and database synchronization become unusable when network coverage drops.

### Privacy and Data Sovereignty
In rural health and sanitation monitoring, capturing photos of water sources or official local documents raises security and privacy concerns if the media must be uploaded to third-party cloud servers.

### The Solution: GramSetu AI
GramSetu AI addresses these issues by running all data processing local to the device. By executing models inside the browser sandbox using WebAssembly (WASM) and WebGL:
* Citizens and local administrators do not require active internet connection to run audits or analyze water test strips.
* No raw images, document text, or local metadata ever leave the user's browser, guaranteeing data privacy.
* The application runs on standard low-spec mobile and desktop hardware with zero server-side maintenance costs.

---

## System Modules

GramSetu AI is divided into four core operational modules:

### 1. SwachhAudit (Sanitation Audit Engine)
An on-device computer vision workflow used to identify public litter, open sewers, and waste heaps.
* **Camera Capture**: Captures snapshots via the device camera or accepts local image uploads.
* **YOLOv8 Inference**: Runs a local YOLOv8-nano model (`public/models/yolov8n.onnx`) via ONNX Runtime Web.
* **Scoring Engine**: Evaluates cleanliness indices based on detected object counts and the bounding box area coverage.
* **Report Generation**: Builds and exports structured PDF audit reports locally using `jsPDF`.

### 2. JalDrishti (Water Quality Analyser)
An colorimetric strip analysis tool for chemical water testing.
* **Alignment Guide**: Displays an on-screen alignment overlay to ensure correct strip placement.
* **Pad Crop & Extraction**: Crops the camera frame to the alignment region, isolates individual test pads, and computes the average RGB/HSL values of each pad.
* **Reference Matcher**: Compares average colors against reference color databases using Euclidean color distance calculation.
* **Recommendations**: Outputs safety assessments (e.g. for pH, Chlorine, Nitrate) and treatment recommendations.

### 3. GramLipi (Regional Document Simplifier)
An OCR and text simplification engine designed to translate and explain official government notices.
* **Local OCR**: Extracts raw text from images using `Tesseract.js` running inside a Web Worker.
* **Text Preprocessing**: Upscales low-resolution images and applies adaptive contrast stretching to improve character recognition rates on skewed photos.
* **Local LLM Integration**: Communicates with a local Ollama server hosting the `llama3.2:3b` model to simplify bureaucratic language and translate text between English and Kannada.

### 4. SwachhSankalp (Community Roadmap & Planning)
A community roadmap dashboard that maps local cleanliness metrics and tasks.
* **Checklist Manager**: Tracks village sanitation tasks, dynamically recalculating the overall village cleanliness score upon task completion.
* **Campaign Tracker**: Registers volunteers for local cleanup campaigns.
* **Ward Leaderboard**: Lists ward rankings based on audited cleanliness scores to encourage community participation.

---

## Technology Stack

* **Frontend Framework**: Next.js 16 (App Router)
* **View Layer**: React 19
* **Language**: TypeScript 5
* **Styling**: Tailwind CSS 4
* **Icons**: Lucide React
* **AI Runtime**: ONNX Runtime Web (WASM / WebGL)
* **OCR Library**: Tesseract.js (Web Workers)
* **Document Export**: jsPDF

---

## Directory Structure

```
d:\GramSetu AI
├── app/                              # Next.js App Router folders
│   ├── (dashboard)/                  # Central landing portal page
│   ├── settings/                     # User preference controls
│   ├── swachh-audit/                 # Sanitation audit module sandbox
│   ├── jaldrishti/                   # Water testing module sandbox
│   ├── gramlipi/                     # Document simplifier module sandbox
│   └── swachhsankalp/                # Planning & community dashboard sandbox
├── components/                       # Shared UI library
│   ├── cards/                        # Dashboard and stat cards
│   ├── common/                       # Containers and page headers
│   ├── layout/                       # Sidebar, navbar, and shell structures
│   └── ui/                           # Button, card, and loading skeleton primitives
├── constants/                        # Global routes, themes, and modules mappings
├── contexts/                         # React context state managers (Theme, GlobalState)
├── hooks/                            # Shared custom React hooks
├── public/                           # Static assets
│   └── models/                       # Local model weight caches
└── utils/                            # Core helper utilities (cn, formatting)
```

---

## On-Device AI & Cloud Architecture

### Zero-Cloud Architecture
GramSetu AI relies on **zero** cloud services for machine learning, image processing, or data persistence. 
* **Model Loading**: When a user opens an AI module, the model (e.g. YOLOv8 ONNX file or Tesseract language training set) is requested from the local web server. The browser caches these assets.
* **Inference Boundary**: The model runs entirely within the browser's sandbox. Raw pixel arrays are read from HTML5 canvas components and passed to WASM/WebGL memory buffers. No image data is transmitted over the network.
* **Data Storage**: Audit history, checklists, ward scores, and campaign lists are stored in `window.localStorage` inside the user's browser profile.

---

## Local Development & Setup

### Prerequisites
* **Node.js**: Version `20.x` or later.
* **npm**: Version `10.x` or later.
* **Ollama**: Required locally for the GramLipi text translation module.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Partha-Shankar/GramSetu_AI.git
   cd GramSetu_AI
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally
1. Start the Next.js development server:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000` in your web browser.

### Local LLM Integration (Optional)
To run translation and simplification in GramLipi, configure a local Ollama server:
1. Download Ollama from [ollama.com](https://ollama.com).
2. Pull the required model:
   ```bash
   ollama pull llama3.2:3b
   ```
3. Run Ollama with browser origin access enabled:
   * **Windows (PowerShell)**:
     ```powershell
     $env:OLLAMA_ORIGINS="http://localhost:3000"
     ollama serve
     ```
   * **macOS / Linux**:
     ```bash
     OLLAMA_ORIGINS="http://localhost:3000" ollama serve
     ```

### Build & Production Test
Generate the production compile bundle:
```bash
npm run build
```

---

## License

This project is open-source and distributed under the MIT License.
