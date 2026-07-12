# JalDrishti

## Purpose
Provides offline analysis of local water sources, analyzing ph-value, turbidity, and identifying contaminants using visual and numeric models on-device.

## Assigned Developer
Developer 2

## Folder Structure
- `components/` - Module-specific UI and water source maps.
- `hooks/` - Module state hooks and device readings calculators.
- `services/` - On-device estimation services and local history DB.
- `types/` - Source reading type contracts.
- `utils/` - Math helpers for ph and turbidity calculations.

## Rules
1. All changes must stay inside `app/jaldrishti/`.
2. Do not import components or helper code from other feature modules (e.g. `app/swachhaudit/`).
3. Only use root-level shared layouts, types, and hooks in `components/`, `types/`, and `hooks/`.
4. Follow strict TypeScript conventions.

## Current Status
Planning
