# Implementation Tasks: Morning Shop Dashboard (MVP-02)

## Phase 0: UI/UX Design & Specification (Tracer Bullet 0)
### Task 0.1: Multi-Interface Design Exploration
- [x] Use skill `design-an-interface.md` to explore 3 radically different UI layouts (High Contrast, Sunrise Canvas, Quick Grid).
- [x] Create mockups for the "Morning" color palette (Warm Yellow, Coffee Brown, Sunrise Gradient).
- [x] Define the Chart styling (Line vs Bar) for optimal legibility in outdoor environments.
- [x] **Acceptance**: A finalized design system and layout are approved by the user.

## Phase 1: Foundation & Data Engine (Tracer Bullet 1)
### Task 1.1: Raw Transaction Data Service
- [x] Create/Update API service to fetch raw transactions from GAS.
- [x] Implement data mapping for `completed` and `voided` statuses.
- [x] Logic for period filtering (UTC+7): [Today], [Yesterday], [7 Days], [This Month].
- [x] **Acceptance**: Data is fetched and correctly filtered into 4 buckets in the console.

### Task 1.2: Summary Metrics UI
- [x] Implement Tab switcher for the 4 time periods.
- [x] Create Morning Summary cards: Revenue (฿), Cup Count, Order Count, and AOV.
- [x] **UI Requirement**: Apply approved design from Task 0.1 (Morning theme).
- [x] **Acceptance**: Metrics update instantly when switching between [Today] and [7 Days].

---

## Phase 2: Visual Analytics (Tracer Bullet 2)
### Task 2.1: Morning Rush Hour Chart
- [x] Implement a line or bar chart showing order frequency by hour (06:00 - 11:00+).
- [x] Ensure the chart is responsive and high contrast for outdoor use.
- [x] **UI Requirement**: Use skill `frontend-design.md` for a premium, clean chart aesthetic.
- [x] **Acceptance**: The chart clearly identifies the peak hour for the selected period.

### Task 2.2: Top Selling Menu Items
- [x] Implement a horizontal bar chart showing the Top 5 best-selling items.
- [x] Logic to group raw transactions by menu name and count.
- [x] **Acceptance**: Displays the correct ranking of the top 5 items for the selected period.

---

## Phase 3: Insights & History (Tracer Bullet 3)
### Task 3.1: Fast Selling Insight
- [x] Logic to determine the "Fastest Selling" item (e.g., sold out earliest or highest velocity).
- [x] Display as a dedicated insight card with high visibility.
- [x] **Acceptance**: The card accurately highlights which item is performing best in terms of speed.

### Task 3.2: Enhanced Transaction List & Void
- [x] Implement the recent transactions list at the bottom of the dashboard.
- [x] Connect the "Void" button to the GAS endpoint to update status.
- [x] **Acceptance**: Clicking Void updates the UI state and successfully sends the request to GAS.

---

## Phase 4: UX & Morning Aesthetics (Tracer Bullet 4)
### Task 4.1: Theme Finalization & Sunrise Gradient
- [x] Apply the "Sunrise Gradient" (Warm Yellow to Light Orange) to the header or background.
- [x] Ensure all components follow the Morning Shop color palette.
- [x] **UI Requirement**: Implement smooth micro-animations for tab transitions and data loading.
- [x] **Acceptance**: The dashboard feels premium, alive, and reflects the "Morning" brand identity.
