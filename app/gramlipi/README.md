# GramLipi

## Purpose
Provides offline OCR scanning and local language translation/summarisation for regional documents and records using lightweight on-device language models.

## Assigned Developer
Developer 3

## Folder Structure
- `components/` - Module-specific UI and OCR document scan terminals.
- `hooks/` - OCR camera feed controls and text capture hooks.
- `services/` - On-device Tesseract/ONNX models and translation services.
- `types/` - Document type schemas and field contracts.
- `utils/` - Local string processors and file exporters.

## Rules
1. All changes must stay inside `app/gramlipi/`.
2. Do not import components or helper code from other feature modules (e.g. `app/swachhsankalp/`).
3. Only use root-level shared layouts, types, and hooks in `components/`, `types/`, and `hooks/`.
4. Follow strict TypeScript conventions.

## Current Status
Planning
