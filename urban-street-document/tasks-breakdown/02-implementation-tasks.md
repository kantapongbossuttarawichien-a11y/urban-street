# Implementation Tasks: Coffee Sales Tracker MVP

## Phase 1: Foundation (Tracer Bullet 1)
### Task 1.1: Project Initialization & Theme Setup
- [x] Initialize Next.js project with Tailwind CSS.
- [x] Setup `Noto Sans Thai` via Google Fonts.
- [x] Configure Tailwind theme with the "High Contrast Solar" color palette.
- [x] Setup basic Layout component (Mobile-first viewport constraints).
- [x] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อออกแบบ Theme และ Layout ให้ดู Premium และอ่านง่ายกลางแดด

### Task 1.2: Authentication Layer
- [x] Implement NextAuth.js (Credentials Provider with admin/admin1234).
- [x] Create Protected Route logic (Middleware).
- [x] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อสร้างหน้า Login ที่เรียบง่ายแต่ดูดี

---

## Phase 2: Data Connectivity (Tracer Bullet 2)
### Task 2.1: Sheety Integration Service
- [x] Create an API utility to fetch/post data using the user-provided URL (`lib/api.ts`).
- [x] Implement Secure Proxy for Sheety API.
- [ ] Create a settings page to input and store Sheety API URL.
- [ ] Connection validator (check if the URL returns a valid response).
- [x] **UI Requirement**: ใช้ skill `frontend-design.md` สำหรับหน้าจอการตั้งค่า API

### Task 2.2: Local-First Storage (Offline Support)
- [x] Implement `localStorage` synchronization for Orders (Offline Queue).
- [x] Logic to check connection status and auto-sync pending orders on mount/save.

---

## Phase 3: Core Features (Tracer Bullet 3)
### Task 3.1: Menu Management Screen
- [x] Fetch menu items from Sheety `Menu` table.
- [x] Create UI to Add/Edit/Delete menu items.
- [x] Implement "Toggle Active" for menu items (to hide out-of-stock).
- [x] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อสร้างหน้าจัดการเมนูที่ใช้งานง่ายบนมือถือ

### Task 3.2: POS Terminal UI & Logic
- [x] Main grid of menu buttons (optimized for one-handed use).
- [x] Order state management (add/remove items, calculate total).
- [x] "Save Order" implementation (write to Sheety `sales`).
- [x] **Bonus**: Drag & Drop reordering for menu items.
- [x] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อสร้างหน้าขาย (POS) ที่เน้นความเร็วและการตอบสนองที่ลื่นไหล

---

## Phase 4: Analytics & Polish (Tracer Bullet 4)
### Task 4.1: Daily Dashboard
- [x] Fetch today's sales data (filtered by UTC+7 timezone).
- [x] UI components for Revenue, Total Cups, and Top Selling chart.
- [x] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อสร้าง Dashboard ที่แสดงข้อมูลได้ชัดเจนและสวยงาม

### Task 4.2: Order History & Voiding
- [x] List recent orders with time and items.
- [x] "Void" functionality (update status in Sheety to `voided`).
- [x] **UI Requirement**: ใช้ skill `frontend-design.md` สำหรับหน้าประวัติการขาย

### Task 4.3: UX Polish
- [ ] High contrast visibility check.
- [x] Micro-animations for feedback (button press, success sync, loading indicators).
- [x] **UI Requirement**: ใช้ skill `frontend-design.md` เพื่อเก็บรายละเอียด Micro-interactions และความลื่นไหลของแอปโดยรวม
