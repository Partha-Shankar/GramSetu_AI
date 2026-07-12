# SwachhAudit

## Purpose
Provides offline-first sanitation audits, waste identification, and reporting using on-device AI computer vision models.


## Folder Structure
- `components/` - Module-specific UI and camera audit forms.
- `hooks/` - Module state machines and video capture hooks.
- `services/` - On-device AI inference runs and image storage.
- `types/` - Document structure and class type definitions.
- `utils/` - Geometry processing and bounding box calculations.

## Rules
1. All changes must stay inside `app/swachhaudit/`.
2. Do not import components or helper code from other feature modules (e.g. `app/jaldrishti/`).
3. Only use root-level shared layouts, types, and hooks in `components/`, `types/`, and `hooks/`.
4. Follow strict TypeScript conventions.


