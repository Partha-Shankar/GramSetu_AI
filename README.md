# GramSetu AI

GramSetu AI is an offline-first, on-device AI platform designed to empower rural communities with intelligent tools for local resource management, sanitation audits, document analysis, and developmental planning, functioning entirely without active internet connectivity.

## Tech Stack
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS & shadcn/ui
- Icons: Lucide React

## Project Structure
Refer to [PROJECT_STRUCTURE.md](file:///d:/GramSetu%20AI/PROJECT_STRUCTURE.md) for a detailed explanation of directories and module boundaries.
- `app/` - Next.js routing and page layouts.
- `components/` - Shared UI and layout elements.
- `contexts/` - Global React state providers.
- `hooks/` - Common custom React hooks.
- `services/` - Workspace-wide external API and storage services.
- `types/` - Shared TypeScript interfaces.
- `utils/` - Shared helper functions.
- `constants/` - Global configurations and values.

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Available Modules
- SwachhAudit - Intelligent sanitation monitoring.
- JalDrishti - Water resource tracking and prediction.
- GramLipi - OCR and local document processing.
- SwachhSankalp - Community-led planning and goal tracking.

