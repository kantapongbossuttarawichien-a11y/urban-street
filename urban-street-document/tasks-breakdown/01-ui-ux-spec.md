# UI/UX Design Specification: Coffee Sales Tracker

## Typography
- **Primary Font**: `Noto Sans Thai`
- **Rationale**: Clean, high legibility, and modern look for both Thai and English text.

## Color Palettes (Proposed)

### Primary Option: "High Contrast Solar" (Recommended for Sunlight)
- **Primary**: `#000000` (Pure Black) - For text and main containers.
- **Secondary**: `#EFFF00` (Electric Yellow) - For primary action buttons (Save/Confirm).
- **Background**: `#FFFFFF` (Pure White).
- **Surface**: `#F4F4F4` (Light Gray) - For menu item cards.

### Secondary Option: "Modern Cafe"
- **Primary**: `#4E342E` (Deep Coffee Brown).
- **Secondary**: `#2E7D32` (Forest Green) - For "Success" actions.
- **Accent**: `#FFAB91` (Peach) - For highlight items.

---

## Page Inventory & Workflow

### 1. Welcome / Login Screen
- **Elements**: Brand logo, "Login with Google" button.
- **Workflow**: User logs in -> Redirected to POS (if Sheety URL exists) or Settings (if first time).

### 2. POS Terminal (Main Screen)
- **Layout**: 
    - Top: Daily Quick Summary (Revenue/Cups).
    - Middle: Scrollable Grid of Menu Items (Large buttons).
    - Bottom: Floating "Checkout Bar" showing current total.
- **Workflow**: Tap Menu -> Qty +1 -> Total Updates -> Long Press "Save" (to prevent accidental clicks) -> Data synced to LocalStorage & Sheety.

### 3. Daily Dashboard
- **Elements**: 
    - Large text: Today's Total Revenue.
    - Mini Bar Chart: Top 5 Selling Items.
    - List: Recent 5 Transactions.
- **Workflow**: View stats -> Tap transaction to see details or Void.

### 4. Menu Management
- **Elements**: List of all menus with Edit/Delete icons. FAB (Floating Action Button) to add new.
- **Workflow**: Tap Edit -> Modal opens -> Change price/name -> Save -> Updates Sheety.

### 5. Settings
- **Elements**: Input field for "Sheety API URL", "Test Connection" button, Sign out.
- **Workflow**: User pastes URL -> App validates -> Success message -> POS is unlocked.

---

## UI Workflow Diagram (Conceptual)
`Login` -> `Settings (Setup)` -> `POS` <-> `Dashboard` <-> `Menu Management`
                             ^
                             |
                      `Offline Cache`
