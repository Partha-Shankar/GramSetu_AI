# Project Structure

This project follows a strict architectural separation. Shared logic lives in the root directory, while module-specific features live in isolated directories inside `app/`.

## Directory Map

- `app/` - App router structure.
  - `(dashboard)/` - Shared dashboard main view.
  - `settings/` - Shared system settings view.
  - `swachhaudit/` - Sanitation monitoring module boundary.
  - `jaldrishti/` - Water monitoring module boundary.
  - `gramlipi/` - Document analysis module boundary.
  - `swachhsankalp/` - Planning and community roadmap module boundary.
- `components/` - Shared, reusable components.
  - `ui/` - Atomic, styled primitives (e.g., buttons, cards, status-badges).
  - `layout/` - Shell structural elements (e.g., AppShell, Sidebar, TopNavbar).
  - `navigation/` - Shared links and routing lists.
  - `common/` - Multi-page shared templates (e.g., Container, EmptyState).
  - `cards/` - Shared descriptive cards.
  - `forms/` - Reusable form helpers.
  - `feedback/` - Toast alerts, dialogues.
  - `charts/` - Shared plotting helpers.
- `contexts/` - Global React State Providers (e.g., AppContext, ThemeContext).
- `hooks/` - Workspace-wide React hooks (e.g., useLocalStorage, useMobile).
- `services/` - Workspace-wide API endpoints and local SQLite/IndexedDB connections.
- `types/` - Shared TypeScript interfaces.
- `utils/` - Shared utility functions.
- `constants/` - Shared static values, design system mappings, and routes.
- `public/` - Public assets.
  - `models/` - On-device AI model weights (.onnx, .bin).
  - `icons/` - Icons.
  - `images/` - Static illustrations.

## Module Boundaries

Each module directory inside `app/` operates as an independent sandbox. They contain their own folders:
- `components/` - Module-specific UI.
- `hooks/` - Module-specific state hooks.
- `services/` - Local processing and service layers.
- `types/` - Custom types.
- `utils/` - Custom math or formatting helpers.

Developers must only edit code inside their assigned module directory and use shared components from the root. Never import files from another developer's module folder.
