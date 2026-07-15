# SwachhSankalp - Community Action Dashboard Module

SwachhSankalp provides village planning tools, cleanliness checklists, community cleanup campaign tracking, and ward leaderboards to encourage citizen participation in resource management.

---

## Technical Specifications

### Cleanliness Index Logic
* **Village Cleanliness Score**: Calculated dynamically based on the completion state of checklist tasks:
  $$Village\ Score = \text{round}\left(\frac{\sum \text{Completed Task Impact Scores}}{\sum \text{Total Task Impact Scores}} \times 100\right)$$
* **Impact Scores**: Tasks carry customizable weights (e.g. Sanitation = 15 points, Waste Disposal = 20 points).

### Data Persistence & Synchronization
* **Database Adapter**: The localStorage engine in [storage.ts](file:///d:/GramSetu%20AI/app/swachhsankalp/services/storage.ts) reads/writes stringified JSON data locally.
* **Initialization**: In-memory static datasets seed the browser profile when no localStorage keys exist.
* **State Updates**: React state updates are deferred to the next event loop tick using `setTimeout` callbacks inside `useEffect` hooks, bypassing rendering cascade loops.

---

## File Structure & Component Reference

```
app/swachhsankalp/
├── page.tsx                          # SwachhSankalp Page Controller
├── types/
│   └── index.ts                      # Interfaces: ChecklistTask, Campaign, WardScore
├── services/
│   └── storage.ts                    # LocalStorage read/write wrappers
├── hooks/
│   └── useSwachhData.ts              # Checklist & campaigns state engine
└── components/
    ├── StatsCards.tsx                # Overview cards for campaigns and volunteers
    ├── CleanlinessScore.tsx          # Circular gauge displaying the village score
    ├── ChecklistManager.tsx          # Task list with dynamic add/toggle rules
    ├── CampaignTracker.tsx           # Cleanup events list with join options
    └── WardLeaderboard.tsx           # Cleanliness score rank listing for wards
```

### Component Details
* **StatsCards**: Displays summary cards (volunteers, completed drives, total tasks) and hosts the "Report Waste" callback to increment report counts.
* **CleanlinessScore**: Renders an interactive circular SVG gauge mapped to the calculated cleanliness score.
* **ChecklistManager**: Lists tasks with custom category color labels, allowing users to toggle completion states or append new tasks.
* **CampaignTracker**: Renders cards for cleanup drives. Users can join campaigns, dynamically updating participant counts and drive progress.
* **WardLeaderboard**: Lists village wards sorted by cleanliness scores, attaching rank badge states.

---

## Development Guidelines

1. **Keep Changes Local**: All changes must remain inside the `app/swachhsankalp/` directory.
2. **Context and Shared Components**: Do not import components or utilities directly from other modules (e.g. `app/swachh-audit/` or `app/jaldrishti/`). Use global styles and root components from the root directory.
3. **Adding Default Tasks/Campaigns**: To adjust default checklist items, update the seed arrays inside `services/storage.ts`.
