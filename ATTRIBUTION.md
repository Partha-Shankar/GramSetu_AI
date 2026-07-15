# GramSetu AI - Software Attribution & Third-Party Licenses

This document acknowledges the third-party open-source libraries, framework tools, fonts, icons, and machine learning models used in GramSetu AI.

---

## 1. Third-Party Libraries & Frameworks

We use the following open-source dependencies (defined in [package.json](file:///d:/GramSetu%20AI/package.json)):

| Library | Purpose | License |
| :--- | :--- | :--- |
| **Next.js 16** | Core react framework, App Router, static exporting | MIT License |
| **React 19** | View layer execution | MIT License |
| **TypeScript 5** | Static type checking | Apache-2.0 License |
| **Tailwind CSS 4** | Styling engine and custom layout tokens | MIT License |
| **onnxruntime-web** | In-browser model execution (WASM / WebGL) | MIT License |
| **Tesseract.js** | Pure Javascript OCR engine running in Web Workers | Apache-2.0 License |
| **jsPDF** | In-browser PDF generation and binary exports | MIT License |
| **lucide-react** | SVG icon library | ISC License |
| **clsx** | Classname string construction | MIT License |
| **tailwind-merge** | Safe utility class merging | MIT License |

---

## 2. Open-Source Machine Learning Models

### YOLOv8-nano (Object Detection Model)
- **Developer**: Ultralytics
- **Usage**: Used in SwachhAudit for detecting litter, waste types, and sanitation issues.
- **License**: AGPL-3.0 License / Enterprise License

### Tesseract OCR Models
- **Developer**: Google / Tesseract contributors
- **Usage**: Language training sets used in GramLipi for character recognition.
- **License**: Apache-2.0 License

---

## 3. Fonts & Typography

### Google Fonts
- **Font Families**: *Inter* and *Outfit*
- **Usage**: Main application typography, headers, and UI panels.
- **License**: SIL Open Font License (OFL)
